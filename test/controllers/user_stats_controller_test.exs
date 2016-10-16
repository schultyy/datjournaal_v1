defmodule Datjournaal.UserStatsControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user()
    {:ok, _stats} = Datjournaal.ConnCase.create_stats()
    {:ok, _stats} = Datjournaal.ConnCase.create_stats()
    {:ok, _stats} = %{year: 2016, month: 10, day: 15, hour: 12, minute: 23, second: 0}
                      |> Ecto.DateTime.cast!
                      |> Datjournaal.ConnCase.create_stats()
    {:ok, _stats} = %{year: 2016, month: 10, day: 15, hour: 10, minute: 23, second: 0}
                      |> Ecto.DateTime.cast!
                      |> Datjournaal.ConnCase.create_stats()
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{user: user, jwt: jwt}}
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

  test "GET /api/v1/userstats as authenticated user", %{user: _user, jwt: jwt} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    assert response.status == 200
  end

  test "GET /api/v1/userstats as authenticated user delivers stats for today", %{user: _user, jwt: jwt} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    stats = response.resp_body
      |> Poison.decode!
      |> Map.get("stats")
      |> Map.get("today")
    assert length(stats) == 2
  end

  # test "GET /api/v1/userstats as authenticated user delivers stats for "
end
