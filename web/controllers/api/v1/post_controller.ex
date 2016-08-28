defmodule Datjournaal.PostController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:create]

  alias Datjournaal.{Repo, Post}

  def index(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)

    render(conn, "index.json", posts: ["Dies, das", "Dolor sit happens"])
  end

  def create(conn, %{"post" => post_params}) do
    current_user = Guardian.Plug.current_resource(conn)

    changeset = current_user
      |> build_assoc(:owned_boards)
      |> Post.changeset(post_params)

    case Repo.insert(changeset) do
      {:ok, post} ->
        conn
        |> put_status(:created)
        |> render("show.json", post: post )
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end
end
