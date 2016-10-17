defmodule Datjournaal.PostControllerTest do
  use Datjournaal.ConnCase

  setup do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    Datjournaal.Post.changeset(%Datjournaal.Post{}, %{description: "this and that", hidden: false, user: 1, image: upload})
      |> Datjournaal.Repo.insert
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{user: user, jwt: jwt}}
  end

  test "GET /", %{conn: conn} do
    response = get conn, "/api/v1/posts"
    assert response.status == 200
  end

  test "GET / returns posts with correct image url" do
    response = get build_conn, "/api/v1/posts"
    post = response.resp_body
            |> Poison.decode!
            |> Map.get("posts")
            |> List.first
    url = Map.get(post, "image")
    assert Regex.match?(~r/\/uploads\//, url)
  end

  test "GET / logs one access" do
    get build_conn, "/api/v1/posts"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat)
    assert length(stats) == 1
  end

  test "GET / logs one access with route '/'" do
    get build_conn, "/api/v1/posts"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :path) == "/api/v1/posts"
  end

  test "GET / logs access with hashed remote IP address" do
    get build_conn, "/api/v1/posts"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :ip) == "12CA17B49AF2289436F303E0166030A21E525D266E209267433801A8FD4071A0"
  end

  test "GET / logs access with hashed remote IP address passed via x-forwarded-for" do
    conn = build_conn()
           |> put_req_header("x-forwarded-for", "5.234.12.12")
    get conn, "/api/v1/posts"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :ip) == "8F4D21ADACE20573A9B35F956E4E15974E48A79EFFF7567DD8770B79A8CB57F7"
  end

  test "GET /posts/:id logs access with post's detail url" do
    get build_conn, "/api/v1/posts/1"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :path) == "/api/v1/posts/1"
  end

  test "GET /posts/:id logs access with hashed remote IP address" do
    get build_conn, "/api/v1/posts/1"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :ip) == "12CA17B49AF2289436F303E0166030A21E525D266E209267433801A8FD4071A0"
  end

  test "POST /api/v1/posts returns 201", %{user: _user, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    assert response.status == 201
  end

  test "POST /api/v1/posts creates a new post", %{user: _user, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    assert length(Repo.all(Datjournaal.Post)) == 2
  end

  test "POST /api/v1/posts creates a new post with a slug", %{user: _user, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    post_id = response.resp_body
      |> Poison.decode!
      |> Map.get("id")
    post = Repo.get(Datjournaal.Post, post_id)
    assert post.slug != nil
  end

  test "GET /api/v1/posts/:slug returns post by its slug" do
    post_from_db = Repo.all(Datjournaal.Post)
            |> List.first
    response = get build_conn(), "/api/v1/posts/#{post_from_db.slug}"
    post_from_service = response.resp_body
            |> Poison.decode!
    assert Map.get(post_from_service, "slug") == Map.get(post_from_db, :slug)
  end
end
