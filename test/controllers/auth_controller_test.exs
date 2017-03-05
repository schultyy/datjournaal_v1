defmodule Datjournaal.AuthControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{jwt: jwt}}
  end

  test "GET /api/v1/auth/request as anonymous user returns 401 status code", %{ jwt: _jwt } do
    response = get conn, "/api/v1/auth/request"
    assert response.status == 403
  end

  test "GET /api/v1/auth/request as authenticated user returns redirect", %{ jwt: jwt }do
    conn = build_conn
            |> put_req_header("authorization", jwt)
    response = get conn, "/api/v1/auth/request"
    assert response.status == 302
  end
end