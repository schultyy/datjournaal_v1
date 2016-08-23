defmodule Datjournaal.User do
  use Datjournaal.Web, :model

  schema "users" do
    field :handle, :string
    field :email, :string
    field :encrypted_password, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:handle, :email, :encrypted_password])
    |> validate_required([:handle, :email, :encrypted_password])
  end
end
