defmodule Datjournaal.PostView do
  use Datjournaal.Web, :view

  def render("index.json", %{posts: posts}) do
    %{posts: posts}
  end

  def render("show.json", %{post: post}) do
    post
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      %{} |> Map.put(field, detail)
    end)

    %{
      errors: errors
    }
  end
end
