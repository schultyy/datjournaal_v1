defmodule Datjournaal.Repo.Migrations.MakeImagesHideable do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :hidden, :boolean, default: :false
    end
  end
end
