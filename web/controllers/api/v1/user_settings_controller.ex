defmodule Datjournaal.UserSettingsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController]

  alias Datjournaal.{Repo, User}

  def reset_password(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    changeset = current_user |> User.change_password_changeset(params)

    case Repo.update(changeset) do
      {:ok, user}         -> render(conn, "reset_password.json", %{ user: user, changeset: nil })
      {:error, changeset} -> conn
              |> put_status(:unprocessable_entity)
              |> render("reset_password.json", %{ user: current_user, changeset: changeset })
    end
  end
end
