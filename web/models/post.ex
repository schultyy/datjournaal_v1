defmodule Datjournaal.Post do
  use Datjournaal.Web, :model
  use Arc.Ecto.Schema

  @derive {Poison.Encoder, only: [:id, :description, :image, :inserted_at, :user]}

  schema "posts" do
    field :description, :string
    field :image, Datjournaal.Image.Type
    belongs_to :user, Datjournaal.User

    timestamps()
  end

  @required_params

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:description])
    |> cast_attachments(params, [:image])
    |> validate_required([:image])
  end
end
