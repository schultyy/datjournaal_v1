defmodule Datjournaal.UserStatsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:index]

  alias Datjournaal.{Repo, UserStat, Post}

  def index(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    today_query = from st in UserStat, where: st.inserted_at > ^yesterday_end and st.logged_in == false
    yesterday_query = from st in UserStat, where: st.inserted_at >= ^yesterday_begin and st.inserted_at <= ^yesterday_end and st.logged_in == false
    thirty_days_query = from st in UserStat, where: st.inserted_at > ^thirty_days_ago and st.logged_in == false
    my_posts = my_posts(current_user)
    today = Repo.all(today_query)
            |> to_local_time
            |> clean
    render(conn, "index.json",
              today: today,
              yesterday: Repo.all(yesterday_query) |> to_local_time,
              thirty_days: Repo.all(thirty_days_query) |> to_local_time,
              popular_posts: my_posts)
  end

  defp to_local_time([]) do
    []
  end

  defp to_local_time([stat | stats]) do
    [convert(stat)] ++ to_local_time(stats)
  end

  defp convert(stat) do
    {:ok, tuple} = stat
            |> Map.get(:inserted_at)
            |> Ecto.DateTime.dump
    converted_time = tuple |> Calendar.DateTime.from_erl!("Europe/Berlin")
    Map.put(stat, :inserted_at, converted_time)
  end

  defp my_posts(user) do
    all_posts_for_user = Repo.all(from p in Post, where: p.user_id == ^user.id, select: p) |> Repo.preload(:user)
    post_slugs = all_posts_for_user |> Enum.map(fn(p) -> p.slug end)
    query = from(st in UserStat, group_by: st.path, where: like(st.path, "/api/v1/posts/%"), select: {st.path, count(st.path)})
    Repo.all(query)
      |> Enum.map(fn({path, count}) -> {String.replace_prefix(path, "/api/v1/posts/", ""), count} end)
      |> Enum.filter(fn({path, _count}) -> Enum.member?(post_slugs, path) end)
      |> Enum.map(fn({path, count}) ->
            p = Enum.find(all_posts_for_user, fn(p) -> p.slug == path end)
            {p, count}
          end)
      |> Enum.sort(fn({_p1, count1}, {_p2, count2}) -> count1 > count2 end)
  end

  defp clean(stats) do
    Enum.filter(stats, fn (x) ->
      inserted_at = Map.get(x, :inserted_at) |> Map.get(:day)
      now = Calendar.DateTime.now!("Europe/Berlin") |> Map.get(:day)
      inserted_at == now
    end)
  end

  defp yesterday_begin do
    date = Calendar.DateTime.now_utc()
      |> Calendar.Date.add!(-1)
      |> Map.put(:hour, 0)
      |> Map.put(:minute, 0)
      |> Map.put(:second, 0)
      |> Ecto.DateTime.cast!
    date
  end

  defp yesterday_end do
    date = Calendar.DateTime.now_utc()
      |> Calendar.Date.add!(-1)
      |> Map.put(:hour, 23)
      |> Map.put(:minute, 59)
      |> Map.put(:second, 59)
      |> Ecto.DateTime.cast!
    date
  end

  defp thirty_days_ago do
    Calendar.DateTime.now_utc()
      |> Calendar.Date.add!(-31)
      |> Map.put(:hour, 23)
      |> Map.put(:minute, 59)
      |> Map.put(:second, 59)
      |> Ecto.DateTime.cast!
  end
end
