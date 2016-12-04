defmodule Datjournaal.UserSettingsController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController]

  alias Datjournaal.{Repo, User, TwitterKey}

  def reset_password(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    changeset = current_user |> User.change_password_changeset(params)

    case Repo.update(changeset) do
      {:ok, user}         -> render(conn, "reset_password.json", %{ user: user, changeset: nil })
      {:error, changeset} -> conn
              |> put_status(:unprocessable_entity)
              |> render("error.json", %{ user: current_user, changeset: changeset })
    end
  end

  def set_twitter_keys(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)

    changeset = current_user
      |> build_assoc(:twitter_key)
      |> TwitterKey.changeset(params)

    case Repo.insert(changeset) do
      {:ok, key } -> render(conn, "twitter_keys.json", %{})
      {:error, changeset } -> conn
                              |> put_status(:unprocessable_entity)
                              |> render("error.json", %{ user: current_user, changeset: changeset })
    end
  end
end
