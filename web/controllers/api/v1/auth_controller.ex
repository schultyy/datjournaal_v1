defmodule Datjournaal.AuthController do
  use Datjournaal.Web, :controller
  alias Datjournaal.Router
  alias Datjournaal.{TwitterKey, Repo}
  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController]
  require Logger

  def request(conn, _params) do
    token = ExTwitter.request_token(
      Router.Helpers.auth_url(conn, :callback)
    )
    {:ok, authenticate_url} = ExTwitter.authenticate_url(token.oauth_token)
    redirect conn, external: authenticate_url
  end

  def callback(conn, %{"oauth_token" => oauth_token, "oauth_verifier" => oauth_verifier}) do
    {:ok, access_token} = ExTwitter.access_token(oauth_verifier, oauth_token)

    ExTwitter.configure(
      :process,
      Keyword.merge(
        ExTwitter.Config.get_tuples,
        [ access_token: access_token.oauth_token,
          access_token_secret: access_token.oauth_token_secret ]
      )
    )
    _user_info = ExTwitter.verify_credentials()

    insert_key_results = set_twitter_keys(conn, %{access_token: access_token.oauth_token,
        access_token_secret: access_token.oauth_token_secret})

    case insert_key_results do
      {:ok, _user} -> conn |> redirect(to: Router.Helpers.page_path(conn, :index, %{}))
      {:error, changeset} ->
        changeset |> log_errors
        conn
          |> redirect(to: Router.Helpers.page_path(conn, :index, %{}))
    end
  end

  def callback(conn, %{"denied" => _}) do
    conn
    |> redirect(to: Router.Helpers.page_path(conn, :index, %{}))
  end

  defp log_errors(changeset) do
    Logger.error("Could not save Twitter credentials")
    Enum.map(changeset.errors, fn(err) ->
      attr_name = elem(err, 0)
      message = elem(err, 1) |> elem(0)
      Logger.error("#{attr_name} - #{message}")
    end)
  end

  defp set_twitter_keys(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    changeset = find_or_create_changeset(current_user)
                |> TwitterKey.changeset(params)
    Repo.insert_or_update(changeset)
  end

  defp find_or_create_changeset(current_user) do
    user_with_twitter_key = Repo.preload(current_user, :twitter_key)
    case user_with_twitter_key.twitter_key do
      nil  -> current_user |> build_assoc(:twitter_key)
      _key -> user_with_twitter_key.twitter_key
    end
  end
end