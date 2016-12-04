defmodule Datjournaal.TwitterKey do
  use Datjournaal.Web, :model

  schema "twitterkeys" do
    field :consumer_key, :string
    field :consumer_secret, :string
    field :access_token, :string
    field :access_token_secret, :string
    belongs_to :user, Datjournaal.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:consumer_key, :consumer_secret, :access_token, :access_token_secret, :user_id])
    |> validate_required([:consumer_key, :consumer_secret, :access_token, :access_token_secret, :user_id])
  end
end
