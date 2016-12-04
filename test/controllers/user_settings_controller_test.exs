defmodule Datjournaal.UserSettingsControllerTest do
  use Datjournaal.ConnCase

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{user: user, jwt: jwt}}
  end

  test "POST /api/v1/users/reset_password with new password returns 200 status code", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    assert response.status == 200
  end

  test "POST /api/v1/users/reset_password with new password sets new password in database", %{user: user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test12345!"
    post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    updated_user = Datjournaal.Repo.get_by(Datjournaal.User, id: user.id)
    assert(Comeonin.Bcrypt.checkpw(new_password, updated_user.encrypted_password))
  end

  test "POST /api/v1/users/reset_password with new password and invalid old password does not set new password in database", %{user: user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test12345!"
    post conn, "/api/v1/users/reset_password", %{ old_password: "fsdfsd", password: new_password }
    updated_user = Datjournaal.Repo.get_by(Datjournaal.User, id: user.id)
    assert(Comeonin.Bcrypt.checkpw(old_password, updated_user.encrypted_password))
  end

  test "POST /api/v1/users/reset_password with new password and invalid old password returns 422 status code", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: "fsdfsd", password: new_password }
    assert(response.status == 422)
  end

  test "POST /api/v1/users/reset_password with too short new password returns 422 status code", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    assert(response.status == 422)
  end

  test "POST /api/v1/users/reset_password with too short new password does not set new password in database", %{user: user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test"
    post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    updated_user = Datjournaal.Repo.get_by(Datjournaal.User, id: user.id)
    assert(Comeonin.Bcrypt.checkpw(old_password, updated_user.encrypted_password))
  end

  test "POST /api/v1/users/reset_password with empty new password returns 403 status code", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = ""
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    assert(response.status == 422)
  end

  test "POST /api/v1/users/reset_password with empty new password does not set new password in database", %{user: user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = ""
    post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    updated_user = Datjournaal.Repo.get_by(Datjournaal.User, id: user.id)
    assert(Comeonin.Bcrypt.checkpw(old_password, updated_user.encrypted_password))
  end

  test "POST /api/v1/users/reset_password with new password but without authorization token returns 403" do
    conn = build_conn()
    old_password = "tester1234!"
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    assert response.status == 403
  end
end
