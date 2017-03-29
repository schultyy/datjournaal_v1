defmodule Datjournaal.SessionController do
  use Datjournaal.Web, :controller
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]
  plug :scrub_params, "session" when action in [:create]

  def create(conn, %{"session" => %{"email" => email, "password" => password}}) do
    case Datjournaal.SessionController.authenticate(conn, %{"email" => email, "password" => password}) do
      {:ok, conn} ->
        user = Datjournaal.Repo.get_by(Datjournaal.User, email: String.downcase(email))
        conn
        |> put_status(:created)
        |> render("show.json", user: user)
      {:error, _reason, conn} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def delete(conn, _) do
    {:ok, claims} = Guardian.Plug.claims(conn)

    conn
    |> Guardian.Plug.current_token
    |> Guardian.revoke!(claims)

    conn
    |> render("delete.json")
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(Datjournaal.SessionView, "forbidden.json", error: "Not Authenticated")
  end

  def authenticate(conn, %{"email" => email, "password" => password}) do
    user = Datjournaal.Repo.get_by(Datjournaal.User, email: String.downcase(email))

    cond do
      user && checkpw(password, user.encrypted_password) ->
        {:ok, login(conn, user)}
      user ->
        {:error, :unauthorized, conn}
      true ->
        dummy_checkpw()
        {:error, :not_found, conn}
    end
  end

  def login(conn, user) do
    conn
    |> assign(:current_user, user)
    |> put_session(:user_id, user.id)
    |> configure_session(renew: true)
  end
end
