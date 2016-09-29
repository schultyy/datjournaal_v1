defmodule Datjournaal.PostController do
  use Datjournaal.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:create, :hide]

  alias Datjournaal.{Repo, Post}

  def index(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    posts = if current_user == nil do
      Repo.all from p in Post,
        order_by: [desc: p.inserted_at],
        where: p.hidden == false,
        select: p,
        limit: 30
    else
      Repo.all from p in Post,
        order_by: [desc: p.inserted_at],
        select: p,
        limit: 30
    end

    posts_with_user = Repo.preload(posts, :user)

    render(conn, "index.json", posts: posts_with_user)
  end

  def show(conn, %{"id" => id}) do
    query = if Guardian.Plug.current_resource(conn) do
      Repo.one(from p in Post, where: p.id == ^id)
    else
      Repo.one(from p in Post, where: p.id == ^id and p.hidden == type(^false, :boolean))
    end

    case query do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("not_found.json", id: id)
      post ->
        conn
        |> put_status(:ok)
        |> render("show.json", post: Repo.preload(post, :user))
    end
  end

  def create(conn, %{"description" => description, "image" => image}) do
    current_user = Guardian.Plug.current_resource(conn)
    post_params = %{
      "description": description,
      "image": inject_unique_filename(image)
    }

    changeset = current_user
      |> build_assoc(:owned_posts)
      |> Post.changeset(post_params)

    case Repo.insert(changeset) do
      {:ok, post} ->
        post_with_user = Repo.preload(post, :user)
        conn
        |> put_status(:created)
        |> render("show.json", post: post_with_user )
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  def hide(conn, %{"id" => id}) do
    set_hidden_status(conn, id, true)
  end

  def show(conn, %{"id" => id}) do
    set_hidden_status(conn, id, false)
  end

  defp set_hidden_status(conn, id, hidden_status) do
    current_user = Guardian.Plug.current_resource(conn)
    case Repo.one(from p in Post, where: p.id == ^id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("not_found.json", id: id)
      post ->
        changeset = post |> Post.set_hidden_changeset(%{hidden: hidden_status})
        case Repo.update(changeset) do
          {:ok, post} ->
            post_with_user = Repo.preload(post, :user)
            conn
            |> put_status(:ok)
            |> render("show.json", post: post_with_user )
          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> render("error.json", changeset: changeset)
        end
    end
  end

  defp inject_unique_filename(%Plug.Upload{:filename => filename} = image) do
    ext = Path.extname(image.filename)
    Map.put(image, :filename, "#{UUID.uuid4()}#{ext}")
  end
  defp inject_unique_filename(_), do: "undefined"
end
