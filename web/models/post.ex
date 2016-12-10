defmodule Datjournaal.Post do
  use Datjournaal.Web, :model
  use Arc.Ecto.Schema

  @derive {Poison.Encoder, only: [:description, :image, :inserted_at, :user, :hidden, :slug, :lat, :lng, :short_location_name, :long_location_name]}

  schema "posts" do
    field :description, :string
    field :hidden, :boolean
    field :image, Datjournaal.Image.Type
    field :slug, :string
    field :lat, :float
    field :lng, :float
    field :short_location_name, :string
    field :long_location_name, :string
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
    |> cast(params, [:description, :lat, :lng, :short_location_name, :long_location_name])
    |> cast_attachments(params, [:image])
    |> validate_required([:image])
    |> validate_lat
    |> validate_lng
    |> create_slug
  end

  def set_hidden_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:hidden])
    |> validate_required([:hidden])
  end

  defp validate_lat(changeset) do
    is_valid = changeset
                |> get_change(:lat)
                |> validate_lat_range
    case is_valid do
      false -> changeset |> add_error(:lat, "Value must be between -90 and +90")
      true -> changeset
    end
  end

  defp validate_lat_range(nil), do: true
  defp validate_lat_range(latitude) do
    latitude >= -90 && latitude <= 90
  end

    defp validate_lng(changeset) do
    is_valid = changeset
                |> get_change(:lng)
                |> validate_lng_range
    case is_valid do
      false -> changeset |> add_error(:lng, "Value must be between -180 and +180")
      true -> changeset
    end
  end

  defp validate_lng_range(nil), do: true
  defp validate_lng_range(longitude) do
    longitude >= -180 && longitude <= 180
  end

  defp create_slug(changeset) do
    put_change(changeset, :slug, UUID.uuid4(:hex))
  end
end
