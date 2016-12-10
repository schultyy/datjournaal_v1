defmodule Datjournaal.Repo.Migrations.AddLocationNamesToPost do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :short_location_name, :string
      add :long_location_name, :string
    end
  end
end
