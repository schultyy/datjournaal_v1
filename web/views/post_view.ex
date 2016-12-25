defmodule Datjournaal.PostView do
  use Datjournaal.Web, :view

  def render("index.json", %{posts: posts}) do
    %{
      posts: Enum.map(posts, &post_with_file_url/1)
    }
  end

  def render("show.json", %{post: post, is_authenticated: is_authenticated}) do
    post |> post_with_file_url |> strip_coords(is_authenticated)
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

  def post_with_file_url(post) do
    filename = Datjournaal.Image.url({post.image, :images}, :thumb)
                |> Path.basename
    image_url = "/uploads/" <> filename
    Map.put(post, :image, image_url)
  end

  defp strip_coords(post, is_logged_in) do
    case is_logged_in do
      true -> post
      false ->
        post
          |> Map.put(:lat, nil)
          |> Map.put(:lng, nil)
    end
  end
end
