defmodule Datjournaal.PostView do
  use Datjournaal.Web, :view

  def render("index.json", %{posts: posts}) do
    %{
      posts: Enum.map(posts, &post_with_file_url/1)
    }
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

  defp post_with_file_url(post) do
    image_url = Datjournaal.Image.url({post.image, :images})
    Map.put(post, :image, image_url)
  end
end
