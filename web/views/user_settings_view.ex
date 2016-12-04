defmodule Datjournaal.UserSettingsView do
  use Datjournaal.Web, :view

  def render("reset_password.json", %{user: _user, changeset: changeset}) do
    #IO.inspect changeset
    case changeset do
      nil -> %{ errors: %{}, success: true }
      _ -> %{ errors: %{}, success: false }
    end
  end
end