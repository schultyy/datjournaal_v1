defmodule Datjournaal.PostControllerTest do
  use Datjournaal.ConnCase

  setup do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    Datjournaal.Post.changeset(%Datjournaal.Post{}, %{description: "this and that", hidden: false, user: 1, image: upload})
      |> Datjournaal.Repo.insert
    :ok
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
end
