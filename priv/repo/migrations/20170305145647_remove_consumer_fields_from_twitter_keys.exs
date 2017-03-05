defmodule Datjournaal.Repo.Migrations.RemoveConsumerFieldsFromTwitterKeys do
  use Ecto.Migration

  def up do
    alter table(:twitterkeys) do
      remove :consumer_key
      remove :consumer_secret
    end
  end

  def down do
    alter table(:twitterkeys) do
      add :consumer_key, :string
      add :consumer_secret, :string
    end
  end
end
