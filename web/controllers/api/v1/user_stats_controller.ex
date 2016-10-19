defmodule Datjournaal.UserStatsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:index]

  alias Datjournaal.{Repo, UserStat}

  def index(conn, _params) do
    today_query = from st in UserStat, where: st.inserted_at > ^yesterday
    thirty_days_query = from st in UserStat, where: st.inserted_at > ^thirty_days_ago
    render(conn, "index.json", today: Repo.all(today_query), thirty_days: Repo.all(thirty_days_query))
  end

  defp yesterday do
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
