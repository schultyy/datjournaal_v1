defmodule Datjournaal.UserStatsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:index]

  def index(conn, _params) do
    render(conn, "index.json", stats: [])
  end
end
