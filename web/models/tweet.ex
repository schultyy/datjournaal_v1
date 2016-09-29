defmodule Datjournaal.Tweet do
  def to_url(post) do
    "http://datjournaal.de/posts/#{post.id}"
  end

  def to_tweet(url, original_text) do
    #We substract three at the end to have enough space for three dots
    max_text_length = 140 - String.length(url) - 3
    if String.length(original_text) > max_text_length do
      text = String.slice(original_text, 0, max_text_length) <> "..."
    else
      text = original_text
    end

    Enum.join([text, url], "\n")
  end
end
