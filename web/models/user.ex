defmodule Datjournaal.User do
  use Datjournaal.Web, :model

  @derive {Poison.Encoder, only: [:id, :handle, :email]}

  schema "users" do
    field :handle, :string
    field :email, :string
    field :encrypted_password, :string
    field :password, :string, virtual: true
    has_many :owned_posts, Datjournaal.Post
    timestamps()
  end

  @required_fields ~w(handle email password)
  @optional_fields ~w(encrypted_password)

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields, @optional_fields)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 5)
    |> validate_confirmation(:password, message: "Password does not match")
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
  end

  def change_password_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, ~w(password), ~w())
    |> validate_old_password(params["old_password"])
    |> validate_length(:password, min: 5)
    |> generate_encrypted_password
  end

  defp validate_old_password(changeset, old_password) do
    user = changeset.data
    case Comeonin.Bcrypt.checkpw(old_password, user.encrypted_password) do
      true -> changeset
      false ->  changeset |> add_error(:password, "Old password does not match")
    end
  end

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        current_changeset
    end
  end
end
