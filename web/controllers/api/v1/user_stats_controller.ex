defmodule Datjournaal.UserStatsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:index]

  alias Datjournaal.{Repo, UserStat}

  def index(conn, _params) do
    query = from st in UserStat, where: st.inserted_at > ^yesterday
    today = Repo.all(query)
    render(conn, "index.json", today: today)
  end

  defp yesterday do
    date = Calendar.DateTime.now_utc()
      |> Calendar.Date.add!(-1)
      |> Map.put(:hour, 0)
      |> Map.put(:minute, 0)
      |> Map.put(:second, 0)
      |> Ecto.DateTime.cast!
    date
  end
end
