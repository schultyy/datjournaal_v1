defmodule Datjournaal.Repo.Migrations.AddIpToUserStat do
  use Ecto.Migration

  def change do
    alter table(:user_stats) do
      add :ip, :string
    end
  end
end
