defmodule Datjournaal.PostView do
  use Datjournaal.Web, :view

  def render("index.json", %{posts: posts}) do
    %{
      posts: Enum.map(posts, &post_with_file_url/1)
    }
  end

  def render("show.json", %{post: post}) do
    post |> post_with_file_url
  end

  def render("not_found.json", %{id: id}) do
    %{
      message: "Post with id #{id} not found"
    }
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      message = detail |> Tuple.to_list |> List.first
      %{} |> Map.put(field, message)
    end)

    %{
      errors: errors
    }
  end

  defp post_with_file_url(post) do
    filename = Datjournaal.Image.url({post.image, :images}, :thumb)
                |> Path.basename
    image_url = "/uploads/" <> filename
    Map.put(post, :image, image_url)
  end
end
