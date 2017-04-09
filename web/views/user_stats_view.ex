defmodule Datjournaal.UserStatsView do
  use Datjournaal.Web, :view

  def render("index.json", %{today: today, yesterday: yesterday, thirty_days: thirty_days, popular_posts: popular_posts}) do
    %{
      "stats": %{
        "today": today,
        "yesterday": yesterday,
        "thirty_days": thirty_days,
        "popular_posts": popular_posts |> render_popular_posts
      }
    }
  end

  defp render_popular_posts(posts) do
    Enum.map(posts, fn({post, count}) ->
      %{
        "post": post |> post_with_thumb_file_url(),
        "views": count
      }
    end)
  end

  defp post_with_thumb_file_url(post) do
    filename = Datjournaal.Image.url({post.image, :images}, :thumb)
                |> Path.basename
    image_url = "/uploads/" <> filename
    Map.put(post, :image, image_url)
  end
end
