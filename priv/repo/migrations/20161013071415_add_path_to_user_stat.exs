defmodule Datjournaal.Repo.Migrations.AddPathToUserStat do
  use Ecto.Migration

  def change do
    alter table(:user_stats) do
      add :path, :string
    end
  end
end
