defmodule Datjournaal.Repo.Migrations.AddLoggedInToStats do
  use Ecto.Migration

  def change do
    alter table(:user_stats) do
      add :logged_in, :boolean, default: false
    end
  end
end
