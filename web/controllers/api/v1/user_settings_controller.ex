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

  def get_twitter_keys(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    user_with_key = Repo.preload(current_user, :twitter_key)
    render(conn, "twitter_keys.json", %{ user: user_with_key })
  end

  def set_twitter_keys(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    changeset = find_or_create_changeset(current_user)
                |> TwitterKey.changeset(params)

    case Repo.insert_or_update(changeset) do
      {:ok, _key } -> render(conn, "twitter_keys.json", %{ })
      {:error, changeset } -> conn
                              |> put_status(:unprocessable_entity)
                              |> render("error.json", %{ user: current_user, changeset: changeset })
    end
  end

  defp find_or_create_changeset(current_user) do
    user_with_twitter_key = Repo.preload(current_user, :twitter_key)
    case user_with_twitter_key.twitter_key do
      nil  -> current_user |> build_assoc(:twitter_key)
      _key -> user_with_twitter_key.twitter_key
    end
  end
end
