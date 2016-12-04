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

  test "POST /api/v1/users/reset_password with new password returns JSON which indicates success", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    was_successful = response.resp_body |> Poison.decode! |> Map.get("success")
    assert was_successful == true
  end

  test "POST /api/v1/users/reset_password with new password returns JSON with empty list of errors", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    old_password = "tester1234!"
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: old_password, password: new_password }
    error_list = response.resp_body |> Poison.decode! |> Map.get("errors")
    assert length(error_list) == 0
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

  test "POST /api/v1/users/reset_password with new password and invalid old password returns JSON which indicates failure", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: "fsdfsd", password: new_password }
    was_successful = response.resp_body |> Poison.decode! |> Map.get("success")
    assert was_successful == false
  end

  test "POST /api/v1/users/reset_password with new password and invalid old password returns JSON with list of errors", %{user: _user, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    new_password = "test12345!"
    response = post conn, "/api/v1/users/reset_password", %{ old_password: "fsdfsd", password: new_password }
    error_list = response.resp_body |> Poison.decode! |> Map.get("errors")
    assert length(error_list) > 0
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

  @twitter_keys %{
    consumer_key: "abc",
    consumer_secret: "abc",
    access_token: "abc",
    access_token_secret: "abc"
  }

  test "POST /api/v1/users/twitter without JWT returns 403", %{ user: _user, jwt: _jwt } do
    response = post build_conn(), "/api/v1/users/twitter", @twitter_keys
    assert response.status == 403
  end

  test "POST /api/v1/users/twitter with valid attributes returns 200", %{ user: _user, jwt: jwt } do
    conn = build_conn()
      |> put_req_header("authorization", jwt)
    response = post conn, "/api/v1/users/twitter", @twitter_keys
    assert response.status == 200
  end
end
