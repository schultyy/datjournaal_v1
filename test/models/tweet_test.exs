defmodule Datjournaal.TweetTest do
  use Datjournaal.ModelCase

  alias Datjournaal.{Tweet, Post}

  test "generates correct url for post" do
    post = %Post{id: 45}
    assert Tweet.to_url(post) == "http://datjournaal.de/posts/45"
  end

  test "Tweet with long text stays within 140 char limit" do
    post = %{id: 34, text: "Wayfarers minim umami, do gochujang quinoa forage banh mi art party. Waistcoat yr blue bottle, shoreditch leggings accusamus wolf tattooed migas nostrud. Sint id celiac, mollit neutra direct trade woke activated charcoal qui tote bag authentic dreamcatcher. Tilde fap portland intelligentsia sunt velit. Hexagon magna commodo, sriracha unicorn locavore craft beer put a bird on it subway tile. Quis do cornhole kale chips jean shorts. Proident enim ugh non, stumptown pabst blog venmo VHS raw denim lomo."}
    url = post |> Tweet.to_url
    assert String.length(Tweet.to_tweet(url, post.text)) <= 140
  end
end
