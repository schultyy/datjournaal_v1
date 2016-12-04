defmodule Datjournaal.Repo.Migrations.CreateTwitterKey do
  use Ecto.Migration

  def change do
    create table(:twitterkeys) do
      add :consumer_key, :string
      add :consumer_secret, :string
      add :access_token, :string
      add :access_token_secret, :string

      timestamps()
    end

  end
end
