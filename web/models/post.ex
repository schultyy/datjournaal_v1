defmodule Datjournaal.Post do
  use Datjournaal.Web, :model
  use Arc.Ecto.Schema

  @derive {Poison.Encoder, only: [:description, :image, :inserted_at, :user, :hidden, :slug]}

  schema "posts" do
    field :description, :string
    field :hidden, :boolean
    field :image, Datjournaal.Image.Type
    field :slug, :string
    belongs_to :user, Datjournaal.User

    timestamps()
  end

  def titleize(post) do
    postfix = "..."
    String.slice(post.description, 0, 140 - String.length(postfix)) <> postfix 
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:description])
    |> cast_attachments(params, [:image])
    |> validate_required([:image])
    |> create_slug
  end

  def set_hidden_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:hidden])
    |> validate_required([:hidden])
  end

  defp create_slug(changeset) do
    put_change(changeset, :slug, UUID.uuid4(:hex))
  end
end
