defmodule Datjournaal.UserSettingsView do
  use Datjournaal.Web, :view

  def render("reset_password.json", %{user: _user, changeset: _changeset}) do
    %{ errors: [], success: true }
  end

  def render("twitter_keys.json", %{ user: user }) do
    key = user.twitter_key
    %{
      access_token_secret: key.access_token_secret,
      access_token: key.access_token
    }
  end

  def render("twitter_keys.json", %{ }) do
    %{ }
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      message = detail |> render_detail
      %{} |> Map.put(field, message)
    end)

    %{
      success: false,
      errors: errors
    }
  end

  defp render_detail({message, values}) do
    Enum.reduce values, message, fn { key, value }, acc ->
      String.replace(acc, "%{#{key}}", to_string(value))
    end
  end
end