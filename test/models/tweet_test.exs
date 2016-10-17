defmodule Datjournaal.TweetTest do
  use Datjournaal.ModelCase

  alias Datjournaal.{Tweet, Post}

  test "generates correct url for post" do
    post = %Post{slug: UUID.uuid4(:hex)}
    assert Tweet.to_url(post) == "http://datjournaal.de/#{post.slug}"
  end

  test "Tweet with long text stays within 140 char limit" do
    post = %{slug: UUID.uuid4(:hex), text: "Wayfarers minim umami, do gochujang quinoa forage banh mi art party. Waistcoat yr blue bottle, shoreditch leggings accusamus wolf tattooed migas nostrud. Sint id celiac, mollit neutra direct trade woke activated charcoal qui tote bag authentic dreamcatcher. Tilde fap portland intelligentsia sunt velit. Hexagon magna commodo, sriracha unicorn locavore craft beer put a bird on it subway tile. Quis do cornhole kale chips jean shorts. Proident enim ugh non, stumptown pabst blog venmo VHS raw denim lomo."}
    url = post |> Tweet.to_url
    assert String.length(Tweet.to_tweet(url, post.text)) <= 140
  end

  test "Tweet with short text is not shortened" do
    tweet_text = "Amsterdam Centraal, mit Zug"
    post = %{slug: UUID.uuid4(:hex), text: tweet_text}
    url = post |> Tweet.to_url
    text = Tweet.to_tweet(url, post.text)
          |> String.split("\n")
          |> List.first
    assert text == tweet_text
  end

  test "Tweet with short text does not contain three dots" do
    post = %{slug: UUID.uuid4(:hex), text: "Amsterdam Centraal, mit Zug"}
    url = post |> Tweet.to_url
    assert String.contains?(Tweet.to_tweet(url, post.text), "...") == false
  end
end
