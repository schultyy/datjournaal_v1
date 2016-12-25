defmodule Datjournaal.Tweet do
  def to_url(post) do
    "http://datjournaal.de/#{post.slug}"
  end
  def to_tweet(url, nil), do: to_tweet(url, "")
  def to_tweet(url, original_text) do
    max_text_length = 140 - String.length(url) - dotlength - String.length(prefix)
    if String.length(original_text) > max_text_length do
      sliced_text = String.slice(original_text, 0, max_text_length) <> "..."
    else
      sliced_text = original_text
    end

    Enum.join([prefix <> sliced_text, url], "\n")
  end

  defp dotlength do
    #Dot length is four at the end to have enough space for three dots and a line break
    4
  end

  defp prefix do
    "📸 "
  end
end
