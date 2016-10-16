defmodule Datjournaal.UserStatsControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user()
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{user: user, jwt: jwt}}
  end

  test "GET /api/v1/userstats as anonymous user" do
    response = get build_conn(), "/api/v1/user_stats"
    assert response.status == 403
  end

  test "GET /api/v1/userstats as authenticated user", %{user: _user, jwt: jwt} do
    response = build_conn()
      |> put_req_header("authorization", jwt)
      |> get("/api/v1/user_stats")
    assert response.status == 200
  end
end
