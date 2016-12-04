defmodule Datjournaal.CurrentUserController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: Datjournaal.SessionController
  alias Datjournaal.{Repo}

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn) |> Repo.preload(:twitter_key)

    conn
    |> put_status(:ok)
    |> render("show.json", user: user)
  end
end
