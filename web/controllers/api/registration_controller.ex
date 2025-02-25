defmodule Datjournaal.RegistrationController do
  use Datjournaal.Web, :controller

  alias Datjournaal.{Repo, User}

  plug :scrub_params, "user" when action in [:create]

  def create(conn, %{"user" => user_params}) do
    changeset = User.changeset(%User{}, user_params)

    case Repo.insert(changeset) do
      {:ok, user} ->
       {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
        conn
        |> put_status(:created)
        |> render(Datjournaal.SessionView, "show.json", %{jwt: jwt, user: user})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Datjournaal.RegistrationView, "error.json", changeset: changeset)
    end
  end
end
