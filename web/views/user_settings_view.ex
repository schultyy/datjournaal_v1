defmodule Datjournaal.UserSettingsView do
  use Datjournaal.Web, :view

  def render("reset_password.json", %{user: _user, changeset: _changeset}) do
    %{ errors: [], success: true }
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      message = detail |> Tuple.to_list |> List.first
      %{} |> Map.put(field, message)
    end)

    %{
      success: false,
      errors: errors
    }
  end
end