defmodule Datjournaal.UserStatsControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, alice} = Datjournaal.ConnCase.create_user()
    {:ok, bob} = Datjournaal.ConnCase.create_user(%{
      handle: "bob",
      email: "bob@example.org",
      password: "tester1234!"
    })
    {:ok, alices_post} = Datjournaal.ConnCase.create_post(alice)
    {:ok, alices_second_post} = Datjournaal.ConnCase.create_post(alice)
    {:ok, bobs_post} = Datjournaal.ConnCase.create_post(bob)
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: true, post: alices_second_post})
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: true, post: alices_second_post})
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: true, post: alices_post})

    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: false, post: alices_post})
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: false, post: alices_post})

    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: true, post: bobs_post})

    yesterday = Calendar.DateTime.now_utc()
            |> Calendar.Date.add!(-1)
    thirty_one_days_ago = Calendar.DateTime.now_utc()
            |> Calendar.Date.add!(-100)

    {:ok, _stats} = %{year: Map.get(yesterday, :year),
                          month: Map.get(yesterday, :month),
                          day: Map.get(yesterday, :day), hour: 12, minute: 23, second: 0}
                      |> Ecto.DateTime.cast!
                      |> Datjournaal.ConnCase.create_stats()
    {:ok, _stats} = %{year: Map.get(yesterday, :year),
                          month: Map.get(yesterday, :month),
                          day: Map.get(yesterday, :day), hour: 10, minute: 23, second: 0}
                      |> Ecto.DateTime.cast!
                      |> Datjournaal.ConnCase.create_stats()
    {:ok, _stats} = %{year: Map.get(thirty_one_days_ago, :year),
                          month: Map.get(thirty_one_days_ago, :month),
                          day: Map.get(thirty_one_days_ago, :day), hour: 10, minute: 23, second: 0}
                      |> Ecto.DateTime.cast!
                      |> Datjournaal.ConnCase.create_stats()
    {:ok, jwt, _full_claims} = alice |> Guardian.encode_and_sign(:token)
    {:ok, %{user: alice, jwt: jwt, oldest_date: thirty_one_days_ago}}
  end

  test "GET /api/v1/userstats as anonymous user" do
    response = get build_conn(), "/api/v1/user_stats"
    assert response.status == 403
  end

  test "GET /api/v1/userstats as anonymous user does not return stats" do
    response = get build_conn(), "/api/v1/user_stats"
    response_body = response.resp_body |> Poison.decode!
    assert Map.get(response_body, "stats") == nil
  end

  test "GET /api/v1/userstats as anonymous user response has error property" do
    response = get build_conn(), "/api/v1/user_stats"
    response_body = response.resp_body |> Poison.decode!
    assert Map.get(response_body, "error") != nil
  end

  test "GET /api/v1/userstats as authenticated user", %{user: _user, jwt: jwt, oldest_date: _d} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    assert response.status == 200
  end

  test "GET /api/v1/userstats as authenticated user delivers stats for today without logged_in user stats", %{user: _user, jwt: jwt, oldest_date: _d} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    stats = response.resp_body
      |> Poison.decode!
      |> Map.get("stats")
      |> Map.get("today")
    assert length(stats) == 2
  end

  test "GET /api/v1/userstats as authenticated user delivers stats for the last 30 days without logged_in user stats", %{user: _user, jwt: jwt, oldest_date: _d} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    stats = response.resp_body
      |> Poison.decode!
      |> Map.get("stats")
      |> Map.get("thirty_days")
    assert length(stats) == 4
  end

  test "GET /api/v1/userstats as authenticated user delivers stats for yesterday", %{user: _user, jwt: jwt, oldest_date: _d} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    stats = response.resp_body
      |> Poison.decode!
      |> Map.get("stats")
      |> Map.get("yesterday")
    assert length(stats) == 2
  end

  test "GET /api/v1/userstats as authenticated user delivers user's images", %{ user: user, jwt: jwt, oldest_date: _d } do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")

    stats = response.resp_body
      |> Poison.decode!
      |> Map.get("stats")
      |> Map.get("popular_posts")
    assert stats |> Enum.map(fn(p) -> Map.get(p, "post") |> Map.get("user") end) |> Enum.all?(fn(post_user) -> Map.get(post_user, "id") == user.id end)
  end

  test "GET /api/v1/userstats as authenticated user delivers user's most popular images", %{ user: _user, jwt: jwt, oldest_date: _d } do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")

    stats = response.resp_body
      |> Poison.decode!
      |> Map.get("stats")
      |> Map.get("popular_posts")
      |> Enum.map(fn(p) -> Map.get(p, "views") end)
    assert Enum.at(stats, 0) > Enum.at(stats, 1)
  end
end
