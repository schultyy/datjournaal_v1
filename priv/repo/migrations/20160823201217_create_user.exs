defmodule Datjournaal.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :handle, :string, null: false
      add :email, :string, null: false
      add :encrypted_password, :string, null: false

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
