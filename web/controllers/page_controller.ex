defmodule Datjournaal.PageController do
  use Datjournaal.Web, :controller

  alias Datjournaal.{Repo, Post}

  def index(conn, params) do
    render_index_with_params(conn, Map.get(params, "path"))
  end

  defp render_index_with_params(conn, []) do
    render conn, "index.html", post: nil
  end

  defp render_index_with_params(conn, params) do
    slug = params |> List.first
    post = Repo.get_by(Post, slug: slug)
    render conn, "index.html", post: post
  end
end
