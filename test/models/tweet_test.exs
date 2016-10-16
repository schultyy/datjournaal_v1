defmodule Datjournaal.TweetTest do
  use Datjournaal.ModelCase

  alias Datjournaal.{Tweet, Post}

  test "generates correct url for post" do
    post = %Post{id: 45}
    assert Tweet.to_url(post) == "http://datjournaal.de/posts/45"
  end
end
