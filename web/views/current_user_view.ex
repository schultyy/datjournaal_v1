defmodule Datjournaal.CurrentUserView do
  use Datjournaal.Web, :view

  def render("show.json", %{user: user}) do
    twitter_configured = user.twitter_key != nil
    %{
      handle: user.handle,
      email: user.email,
      id: user.id,
      twitter_configured: twitter_configured
    }
  end

  def render("error.json", _) do
  end
end
