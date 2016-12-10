defmodule Datjournaal.PostController do
  use Datjournaal.Web, :controller
  import Ecto.Changeset

  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController] when action in [:create, :hide]

  alias Datjournaal.{Repo, Post, UserStat}

  def index(conn, _params) do
    log_user_access(conn)
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
    log_user_access(conn)
    query = if Guardian.Plug.current_resource(conn) do
      Repo.one(from p in Post, where: p.slug == ^id)
    else
      Repo.one(from p in Post, where: p.slug == ^id and p.hidden == type(^false, :boolean))
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

  def create(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)

    post_params = %{
      "description": Map.get(params, "description"),
      "image": inject_unique_filename(Map.get(params, "image")),
      "lat": Map.get(params, "lat"),
      "lng": Map.get(params, "lng")
    }

    post_on_twitter = Map.get(params, "postOnTwitter")

    changeset = current_user
      |> build_assoc(:owned_posts)
      |> Post.changeset(post_params)
      |> fetch_location

    case Repo.insert(changeset) do
      {:ok, post} ->
        post_with_user = Repo.preload(post, user: :twitter_key)
        post_to_twitter(post_on_twitter, post_with_user)
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

  def show_post(conn, %{"id" => id}) do
    set_hidden_status(conn, id, false)
  end

  defp fetch_location(changeset) do
    lat  = changeset |> get_change(:lat)
    long = changeset |> get_change(:lng)
    {long_name, short_name} = Datjournaal.GmapsApiClient.get_location_name(lat, long)
    changeset
      |> put_change(:short_location_name, short_name)
      |> put_change(:long_location_name, long_name)
  end

  defp set_hidden_status(conn, slug, hidden_status) do
    case Repo.one(from p in Post, where: p.slug == ^slug) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("not_found.json", id: slug)
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

  defp post_to_twitter("true", post_with_user) do
    key = post_with_user.user.twitter_key
    case key do
      nil -> {}
      _   ->
        ExTwitter.configure(:process, consumer_key: key.consumer_key,
                                      consumer_secret: key.consumer_secret,
                                      access_token: key.access_token,
                                      access_token_secret: key.access_token_secret)
        Datjournaal.Tweet.to_url(post_with_user)
            |> Datjournaal.Tweet.to_tweet(post_with_user.description)
            |> ExTwitter.update()
    end
  end

  defp post_to_twitter(_post_on_twitter, _post_with_user) do
    {}
  end

  defp inject_unique_filename(%Plug.Upload{:filename => _filename} = image) do
    ext = Path.extname(image.filename)
    Map.put(image, :filename, "#{UUID.uuid4()}#{ext}")
  end
  defp inject_unique_filename(_), do: "undefined"

  defp log_user_access(conn) do
    path = conn.request_path
    logged_in = case Guardian.Plug.current_resource(conn) do
      nil -> false
      _ -> true
    end
    ip_address = conn |> process_ip_address
    changeset = UserStat.changeset(%UserStat{}, %{path: path, ip: ip_address, logged_in: logged_in})
    Repo.insert(changeset)
  end

  defp process_ip_address(conn) do
    Plug.Conn.get_req_header(conn, "x-forwarded-for")
    |> List.first
    |> hash_address
  end

  defp hash_address(nil) do
    :crypto.hash(:sha256, "127.0.0.1")
    |> Base.encode16
  end

  defp hash_address(address) do
    :crypto.hash(:sha256, address)
    |> Base.encode16
  end
end
