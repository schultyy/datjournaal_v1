defmodule Datjournaal.SessionView do
  use Datjournaal.Web, :view

  def render("show.json", %{user: user}) do
    %{
      user: user
    }
  end

  def render("error.json", _) do
    %{error: "Invalid email or password"}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end
end
