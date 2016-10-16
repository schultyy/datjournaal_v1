defmodule Datjournaal.UserStat do
  use Datjournaal.Web, :model

  @derive {Poison.Encoder, only: [:path, :ip, :inserted_at]}

  schema "user_stats" do
    field :path, :string
    field :ip, :string
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:path, :ip])
    |> validate_required([:path, :ip])
  end
end
