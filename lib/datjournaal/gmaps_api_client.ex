defmodule Datjournaal.GmapsApiClient do
  def get_location_name(nil, nil), do: {nil, nil}
  def get_location_name(lat, lng) do
    api_key = Application.get_env(:datjournaal, :gmaps_api_key)
    response = HTTPotion.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=#{lat},#{lng}&key=#{api_key}")
    map_results = response.body
      |> Poison.decode!
      |> Map.get("results")

    long_location_name = map_results
      |> List.first
      |> Map.get("formatted_address")
    short_location_name = map_results
      |> List.first
      |> Map.get("address_components")
      |> extract_district

    {long_location_name, short_location_name}
  end

  defp extract_district(params) do
    # e.g. HafenCity
    sublocality = Enum.find(params, fn(component) ->
      Map.get(component, "types") == ["political", "sublocality", "sublocality_level_2"]
    end)

    # e.g. Hamburg
    locality = Enum.find(params, fn(component) ->
      Map.get(component, "types") == ["locality", "political"]
    end)

    [sublocality, locality]
    |> Enum.map(fn (l) -> Map.get(l, "long_name") end)
    |> Enum.join(", ")
  end
end