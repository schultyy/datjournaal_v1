defmodule Datjournaal.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  import other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest

      alias Datjournaal.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      import Datjournaal.Router.Helpers

      # The default endpoint for testing
      @endpoint Datjournaal.Endpoint
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Datjournaal.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Datjournaal.Repo, {:shared, self()})
    end

    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  def create_user() do
    user_params = %{
      handle: "tester",
      email: "tester@example.org",
      password: "tester1234!"
    }
    create_user(user_params)
  end

  def create_user(user_params) do
    changeset = Datjournaal.User.changeset(%Datjournaal.User{}, user_params)
    Datjournaal.Repo.insert(changeset)
  end

  def create_post(user) do
    upload = %Plug.Upload{path: "test/fixtures/placeholder.jpg", filename: "placeholder.png"}
    post_params = %{description: "this and that", hidden: false, user: user, image: upload, lat: 15.5, lng: 9.5}
    user
    |> Ecto.build_assoc(:owned_posts)
    |> Datjournaal.Post.changeset(post_params)
    |> Datjournaal.Repo.insert
  end

  def create_stats(%{logged_in: logged_in, post: post}) do
    path = "/api/v1/posts/#{post.slug}"
    Datjournaal.UserStat.changeset(%Datjournaal.UserStat{}, %{path: path, ip: "127.0.0.1", logged_in: logged_in})
    |> Datjournaal.Repo.insert
  end

  def create_stats(inserted_at) do
    create_stats(inserted_at, "/")
  end

  def create_stats(inserted_at, image_path) do
    %Datjournaal.UserStat{path: image_path, ip: "127.0.0.1", inserted_at: inserted_at, logged_in: false}
    |> Datjournaal.Repo.insert
  end
end
