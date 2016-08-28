defmodule Datjournaal.Post do
  use Datjournaal.Web, :model

  @derive {Poison.Encoder, only: [:id, :description]}

  schema "posts" do
    field :description, :string
    belongs_to :user, Datjournaal.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:description])
    |> validate_required([:description])
  end
end
