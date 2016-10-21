defmodule Datjournaal.UserStatsControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user()
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: false})
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: false})

    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: true})
    {:ok, _stats} = Datjournaal.ConnCase.create_stats(%{logged_in: true})

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
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{user: user, jwt: jwt, oldest_date: thirty_one_days_ago}}
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
end
