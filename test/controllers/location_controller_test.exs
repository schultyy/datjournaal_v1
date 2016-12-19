defmodule Datjournaal.LocationControllerTest do
  use Datjournaal.ConnCase
  use ExVCR.Mock

  setup_all do
    ExVCR.Config.cassette_library_dir("test/fixtures/vcr_cassettes")
    :ok
  end

  setup do
    {:ok, user} = Datjournaal.ConnCase.create_user
    {:ok, jwt, _full_claims} = user |> Guardian.encode_and_sign(:token)
    {:ok, %{location_name: "Elbgold" |> URI.encode, jwt: jwt}}
  end

  test "GET /api/v1/location without token returns 403", %{location_name: location_name, jwt: _jwt} do
    use_cassette "elbgold_search_location" do
      response = get build_conn(), "/api/v1/location?location_name=#{location_name}"
      assert response.status == 403
    end
  end

  test "GET /api/v1/location with token and location name returns 200 status code", %{location_name: location_name, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    use_cassette "elbgold_search_location" do
      response = get conn, "/api/v1/location?location_name=#{location_name}"
      assert response.status == 200
    end
  end

  test "GET /api/v1/location with token and location name returns latitude and longitude", %{location_name: location_name, jwt: jwt} do
    conn = build_conn()
          |> put_req_header("authorization", jwt)
    use_cassette "elbgold_search_location" do
      response = get conn, "/api/v1/location?location_name=#{location_name}"
      results = response.resp_body |> Poison.decode! |> List.first
      assert Map.get(results, "description") == "Elbgold, Eppendorfer Baum, Hamburg, Germany"
      assert Map.get(results, "main_text") == "Elbgold"
      assert Map.get(results, "places_id") == "ChIJd6oNXsqIsUcRhkTvSBr6lSE"
    end
  end
end