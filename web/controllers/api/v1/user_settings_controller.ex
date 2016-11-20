defmodule Datjournaal.UserSettingsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController]

  alias Datjournaal.{Repo, User}

  def reset_password(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    render("reset_password.json")
  end
end
