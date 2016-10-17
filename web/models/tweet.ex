defmodule Datjournaal.Tweet do
  def to_url(post) do
    "http://datjournaal.de/#{post.slug}"
  end

  def to_tweet(url, original_text) do
    #We substract four at the end to have enough space for three dots and a line break
    max_text_length = 140 - String.length(url) - 4
    if String.length(original_text) > max_text_length do
      text = String.slice(original_text, 0, max_text_length) <> "..."
    else
      text = original_text
    end

    Enum.join([text, url], "\n")
  end
end
