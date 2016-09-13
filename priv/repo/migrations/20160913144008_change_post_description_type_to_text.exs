defmodule Datjournaal.Repo.Migrations.ChangePostDescriptionTypeToText do
  use Ecto.Migration

  def change do
    alter table(:posts) do
        modify :description, :text
    end
  end
end
