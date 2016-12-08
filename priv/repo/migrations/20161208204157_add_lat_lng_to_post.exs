defmodule Datjournaal.Repo.Migrations.AddLatLngToPost do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :lat, :float, default: nil
      add :lng, :float, default: nil
    end
  end
end
