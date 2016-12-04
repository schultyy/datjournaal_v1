defmodule Datjournaal.Repo.Migrations.AddUserIdToTwitterKey do
  use Ecto.Migration

  def change do
    alter table(:twitterkeys) do
      add :user_id, references(:users)
    end
  end
end
