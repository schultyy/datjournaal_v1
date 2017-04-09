defmodule Datjournaal.PostControllerTest do
  use Datjournaal.ConnCase
  use ExVCR.Mock

  setup_all do
    ExVCR.Config.cassette_library_dir("test/fixtures/vcr_cassettes")
    :ok
  end

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, post} = Datjournaal.ConnCase.create_post(user)
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{post: post, jwt: jwt}}
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

  test "GET / as anonymous user logs one access with logged_in = false" do
    get build_conn, "/api/v1/posts"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :logged_in) == false
  end

  test "GET / as authenticated user logs one access with route '/' and logged_in = true", %{post: _post, jwt: jwt} do
    conn = build_conn
    |> put_req_header("authorization", jwt)
    get conn, "/api/v1/posts"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :logged_in) == true
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

  test "GET /posts/:id as anonymous user logs one access with logged_in = false" do
    get build_conn, "/api/v1/posts/1"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :logged_in) == false
  end

  test "GET /posts/:id as authenticated user logs one access with route '/' and logged_in = true", %{post: _post, jwt: jwt} do
    conn = build_conn
    |> put_req_header("authorization", jwt)
    get conn, "/api/v1/posts/1"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :logged_in) == true
  end

  test "GET /posts/:id logs access with hashed remote IP address" do
    get build_conn, "/api/v1/posts/1"
    stats = Datjournaal.Repo.all(Datjournaal.UserStat) |> List.first
    assert Map.get(stats, :ip) == "12CA17B49AF2289436F303E0166030A21E525D266E209267433801A8FD4071A0"
  end

  test "POST /api/v1/posts returns 201", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    assert response.status == 201
  end

  test "POST /api/v1/posts creates a new post", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    assert length(Repo.all(Datjournaal.Post)) == 2
  end

  test "POST /api/v1/posts creates a new post with a slug", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    post_slug = response.resp_body
      |> Poison.decode!
      |> Map.get("slug")
    post = Repo.get_by(Datjournaal.Post, slug: post_slug)
    assert post.slug != nil
  end

  test "POST /api/v1/posts creates a new post with empty lat/lng", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts", %{image: upload, description: "Dies und das", postOnTwitter: "false"}
    post_slug = response.resp_body
      |> Poison.decode!
      |> Map.get("slug")
    post = Repo.get_by(Datjournaal.Post, slug: post_slug)
    assert post.lat == nil
    assert post.lng == nil
  end

  test "POST /api/v1/posts with lat/long in params creates a new post and stores lat/lng", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    lat = 53.5553857
    lng = 9.9861725
    form_data = %{image: upload, description: "Dies und das", postOnTwitter: "false", lat: lat, lng: lng}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    use_cassette "valentinskamp_location" do
      response = post conn, "/api/v1/posts", form_data
      post_slug = response.resp_body
        |> Poison.decode!
        |> Map.get("slug")
      post = Repo.get_by(Datjournaal.Post, slug: post_slug)
      assert post.lat == lat
      assert post.lng == lng
    end
  end

  test "POST /api/v1/posts with lat/long adds short and long displayname", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    lat = 53.5409384
    lng = 9.9843591
    form_data = %{image: upload, description: "Dies und das", postOnTwitter: "false", lat: lat, lng: lng}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    use_cassette "elbphilharmonie_location" do
      response = post conn, "/api/v1/posts", form_data
      post_slug = response.resp_body
                  |> Poison.decode!
                  |> Map.get("slug")
      post = Repo.get_by(Datjournaal.Post, slug: post_slug)
      assert post.short_location_name == "HafenCity, Hamburg"
      assert post.long_location_name == "Platz der Deutschen Einheit 2, 20457 Hamburg, Germany"
    end
  end

  # This test looks the same as the one above.
  # The reason for this test is to ensure that location displaynames are generated properly when we're not in town but somewhere outside
  # in the countryside
  test "POST /api/v1/posts with geoposition in the countryside generates meaningful displaynames", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    lat = 51.36824
    lng = 8.4140813
    form_data = %{image: upload, description: "Dies und das", postOnTwitter: "false", lat: lat, lng: lng}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    use_cassette "nuttlar_schneider_korn_location" do
      response = post conn, "/api/v1/posts", form_data
      post_slug = response.resp_body
                  |> Poison.decode!
                  |> Map.get("slug")
      post = Repo.get_by(Datjournaal.Post, slug: post_slug)
      assert post.short_location_name == "Ostwig, Bestwig"
      assert post.long_location_name == "Alfert 2, 59909 Bestwig, Germany"
    end
  end

  test "POST /api/v1/posts with Google Places Id queries for lat/long and displayname", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    places_id = "ChIJT8RwZwaPsUcRhkKYaCqr5LI" #Elbphilharmonie Hamburg, Platz der Deutschen Einheit, Hamburg, Germany
    form_data = %{image: upload, description: "Dies und das", postOnTwitter: "false", places_id: places_id}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    use_cassette "elbphilharmonie_places_id_query" do
      response = post conn, "/api/v1/posts", form_data
      post_slug = response.resp_body
                  |> Poison.decode!
                  |> Map.get("slug")
      post = Repo.get_by(Datjournaal.Post, slug: post_slug)
      assert post.lat == 53.54133059999999
      assert post.lng == 9.9841274
      assert post.short_location_name == "Elbphilharmonie Hamburg"
      assert post.long_location_name == "Platz der Deutschen Einheit 1, 20457 Hamburg, Germany"
    end
  end

  test "POST /api/v1/posts with Google Places Id and lat/long results in 422 status code", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    lat = 51.36824
    lng = 8.4140813
    places_id = "ChIJT8RwZwaPsUcRhkKYaCqr5LI" #Elbphilharmonie Hamburg, Platz der Deutschen Einheit, Hamburg, Germany
    form_data = %{image: upload, description: "Dies und das", postOnTwitter: "false", lat: lat, lng: lng, places_id: places_id}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts", form_data
    assert response.status == 422
  end

  test "POST /api/v1/posts with invalid Google Places Id results in 422 status code", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    lat = 51.36824
    lng = 8.4140813
    places_id = "ABCDEF"
    form_data = %{image: upload, description: "Dies und das", postOnTwitter: "false", places_id: places_id}
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    use_cassette "invalid_google_places_id" do
      response = post conn, "/api/v1/posts", form_data
      assert response.status == 422
    end
  end

  test "GET /api/v1/posts/:slug returns post by its slug", %{post: post_from_db, jwt: _jwt} do
    response = get build_conn(), "/api/v1/posts/#{post_from_db.slug}"
    post_from_service = response.resp_body
            |> Poison.decode!
    assert Map.get(post_from_service, "slug") == Map.get(post_from_db, :slug)
  end

  test "GET /api/v1/posts/:slug returns post original image", %{post: post_from_db, jwt: _jwt} do
    response = get build_conn(), "/api/v1/posts/#{post_from_db.slug}"
    post_from_service = response.resp_body
            |> Poison.decode!
    assert Map.get(post_from_service, "image") |> String.contains?("original")
  end

  test "POST /api/v1/posts/:slug/hide returns 200 status code", %{post: post, jwt: jwt} do
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts/#{post.slug}/hide"
    assert response.status == 200
  end

  test "POST /api/v1/posts/:slug/hide hides an existing post", %{post: post, jwt: jwt} do
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    post conn, "/api/v1/posts/#{post.slug}/hide"

    is_hidden = Repo.get(Datjournaal.Post, post.id) |> Map.get(:hidden)
    assert is_hidden
  end

  test "POST /api/v1/posts/:slug/show returns 403 if user is not logged in" do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    {:ok, post} = Datjournaal.Post.changeset(%Datjournaal.Post{}, %{description: "this and that", hidden: true, user: 1, image: upload})
      |> Datjournaal.Repo.insert
    Datjournaal.Post.set_hidden_changeset(post, %{hidden: true}) |> Datjournaal.Repo.update
    conn = build_conn()
    response = post conn, "/api/v1/posts/#{post.slug}/show"
    assert response.status == 403
  end

  test "POST /api/v1/posts/:slug/show does not show post if user is not logged in" do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    {:ok, post} = Datjournaal.Post.changeset(%Datjournaal.Post{}, %{description: "this and that", user: 1, image: upload})
      |> Datjournaal.Repo.insert
    Datjournaal.Post.set_hidden_changeset(post, %{hidden: true}) |> Datjournaal.Repo.update
    post build_conn(), "/api/v1/posts/#{post.slug}/show"
    is_hidden = Repo.get(Datjournaal.Post, post.id) |> Map.get(:hidden)
    assert is_hidden == true
  end

  test "POST /api/v1/posts/:slug/show returns 200 status code", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    {:ok, post} = Datjournaal.Post.changeset(%Datjournaal.Post{}, %{description: "this and that", hidden: true, user: 1, image: upload})
      |> Datjournaal.Repo.insert
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/posts/#{post.slug}/show"
    assert response.status == 200
  end

  test "POST /api/v1/posts/:id/show shows an existing post", %{post: _post, jwt: jwt} do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    {:ok, post} = Datjournaal.Post.changeset(%Datjournaal.Post{}, %{description: "this and that", hidden: true, user: 1, image: upload})
      |> Datjournaal.Repo.insert
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    post conn, "/api/v1/posts/#{post.slug}/show"

    is_hidden = Repo.get(Datjournaal.Post, post.id) |> Map.get(:hidden)
    assert !is_hidden
  end

  test "GET /api/v1/posts/<slug> as anonymous user does not return lat/long for a post", %{ post: post, jwt: _jwt } do
    response = get build_conn(), "/api/v1/posts/#{post.slug}"
    post_json = response.resp_body |> Poison.decode!
    lat = Map.get(post_json, "lat")
    lng = Map.get(post_json, "lng")
    assert lat == nil
    assert lng == nil
  end

  test "GET /api/v1/posts/<slug> as logged in user does return lat/long for a post", %{ post: post, jwt: jwt } do
    conn = build_conn()
           |> put_req_header("authorization", jwt)
    response = get conn, "/api/v1/posts/#{post.slug}"
    post_json = response.resp_body |> Poison.decode!
    lat = Map.get(post_json, "lat")
    lng = Map.get(post_json, "lng")
    assert lat != nil
    assert lng != nil
  end

  test "GET /api/v1/posts as anonymous user does not return lat/long for all posts" do
    response = get build_conn(), "/api/v1/posts/"
    coordinates = response.resp_body |> Poison.decode! |> Map.get("posts") |> Enum.map(fn(p) -> { Map.get(p, "lat"), Map.get(p, "lng")} end)
    assert Enum.all?(coordinates, fn(co) -> co == { nil, nil } end) == true
  end

  test "GET /api/v1/posts as logged in user does return lat/long for all posts", %{ post: _post, jwt: jwt } do
    conn = build_conn()
           |> put_req_header("authorization", jwt)
    response = get conn, "/api/v1/posts/"
    coordinates = response.resp_body |> Poison.decode! |> Map.get("posts") |> Enum.map(fn(p) -> { Map.get(p, "lat"), Map.get(p, "lng")} end)
    assert Enum.all?(coordinates, fn(co) -> co != { nil, nil } end) == true
  end
end
