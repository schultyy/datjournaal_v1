defmodule Datjournaal.Repo.Migrations.CreateUserStat do
  use Ecto.Migration

  def change do
    create table(:user_stats) do
      timestamps()
    end
  end
end
