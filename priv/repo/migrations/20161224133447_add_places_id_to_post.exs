defmodule Datjournaal.Repo.Migrations.AddPlacesIdToPost do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :places_id, :string
    end
  end
end
