defmodule Datjournaal.UserStatsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:index]

  alias Datjournaal.{Repo, UserStat}

  def index(conn, _params) do
    stats = Repo.all(UserStat)
    render(conn, "index.json", stats: stats)
  end
end
