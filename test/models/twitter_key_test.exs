defmodule Datjournaal.TwitterKeyTest do
  use Datjournaal.ModelCase

  alias Datjournaal.TwitterKey

  @valid_attrs %{access_token: "some content", access_token_secret: "some content", consumer_key: "some content", consumer_secret: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = TwitterKey.changeset(%TwitterKey{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = TwitterKey.changeset(%TwitterKey{}, @invalid_attrs)
    refute changeset.valid?
  end
end
