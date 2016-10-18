defmodule Datjournaal.UserStatsView do
  use Datjournaal.Web, :view

  def render("index.json", %{today: today, thirty_days: thirty_days}) do
    %{
      "stats": %{
        "today": today,
        "thirty_days": thirty_days
      }
    }
  end
end
