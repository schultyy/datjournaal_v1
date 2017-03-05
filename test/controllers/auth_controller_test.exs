defmodule Datjournaal.AuthControllerTest do
  use Datjournaal.ConnCase
  import Mock

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    credentials = %{name: "test", screen_name: "test"}
    {:ok, %{jwt: jwt, credentials: credentials}}
  end

  test "GET /api/v1/auth/request as anonymous user returns 401 status code", %{ jwt: _jwt, credentials: _credentials } do
    response = get build_conn, "/api/v1/auth/request"
    assert response.status == 403
  end

  test "GET /api/v1/auth/request as authenticated user returns redirect", %{ jwt: jwt, credentials: _credentials }do
    conn = build_conn
            |> put_req_header("authorization", jwt)
    response = get conn, "/api/v1/auth/request"
    assert response.status == 302
  end

  test "GET /api/v1/auth/callback with denied param redirects to home page", %{ jwt: jwt, credentials: _credentials } do
    conn = build_conn
            |> put_req_header("authorization", jwt)
    response = get conn, "/api/v1/auth/callback?denied=denied"
    assert response.status == 302
  end

  test_with_mock "GET /api/v1/auth/callback with oauth and oauth verifier param redirects to home page",
  %{ jwt: jwt, credentials: credentials }, ExTwitter, [], [access_token: fn(_verifier, _token) -> {:ok , %{ oauth_token: "an_access_token", oauth_token_secret: "secret" }} end,
      configure: fn(:process, _args) -> :ok end,
      verify_credentials: fn() -> credentials end] do
    conn = build_conn
            |> put_req_header("authorization", jwt)
      response = get conn, "/api/v1/auth/callback?oauth_token=some_token&oauth_verifier=some_verifier"
      assert response.status == 302
  end
end