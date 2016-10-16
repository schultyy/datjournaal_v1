defmodule Datjournaal.UserStatsView do
  use Datjournaal.Web, :view

  def render("index.json", %{stats: stats}) do
    %{
      "stats": stats
    }
  end
end
