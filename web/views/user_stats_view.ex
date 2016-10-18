defmodule Datjournaal.UserStatsView do
  use Datjournaal.Web, :view

  def render("index.json", %{today: today}) do
    %{
      "stats": %{
        "today": today
      }
    }
  end
end
