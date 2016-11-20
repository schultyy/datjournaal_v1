defmodule Datjournaal.UserSettingsControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{jwt: jwt}}
  end

  test "POST /user with new password returns 200 status code", %{jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, new_password: new_password }
    assert response.status == 200
  end

  test "POST /user with new password rejects if old password does not match", %{jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "fsdfsd!"
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, new_password: new_password }
    assert response.status == 403
  end
end
