defmodule Datjournaal.UserStatsView do
  use Datjournaal.Web, :view

  def render("index.json", %{today: today, yesterday: yesterday, thirty_days: thirty_days}) do
    %{
      "stats": %{
        "today": today,
        "yesterday": yesterday,
        "thirty_days": thirty_days
      }
    }
  end
end
