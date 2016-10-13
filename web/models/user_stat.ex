defmodule Datjournaal.UserStat do
  use Datjournaal.Web, :model

  schema "user_stats" do
    field :path, :string
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:path])
    |> validate_required([:path])
  end
end
