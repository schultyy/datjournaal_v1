defmodule Datjournaal.PostController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:create]

  alias Datjournaal.{Repo, Post}

  def index(conn, _params) do
    posts = Repo.all from p in Post,
        order_by: [desc: p.inserted_at],
        select: p,
        limit: 30

    render(conn, "index.json", posts: posts)
  end

  def create(conn, %{"description" => description, "image" => image}) do
    current_user = Guardian.Plug.current_resource(conn)

    post_params = %{
      "description": description,
      "image": image
    }

    IO.inspect("POST PARAMS")
    IO.inspect(post_params)
    
    changeset = current_user
      |> build_assoc(:owned_posts)
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
