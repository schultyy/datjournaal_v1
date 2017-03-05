defmodule Datjournaal.AuthController do
  use Datjournaal.Web, :controller
  alias Datjournaal.Router
  alias Datjournaal.{TwitterKey, Repo}
  plug Guardian.Plug.EnsureAuthenticated, [handler: Datjournaal.SessionController]

  def request(conn, _params) do
    token = ExTwitter.request_token(
      Router.Helpers.auth_url(conn, :callback)
    )
    {:ok, authenticate_url} = ExTwitter.authenticate_url(token.oauth_token)
    redirect conn, external: authenticate_url
  end

  def callback(conn, %{"oauth_token" => oauth_token, "oauth_verifier" => oauth_verifier}) do
    {:ok, access_token} = ExTwitter.access_token(oauth_verifier, oauth_token)

    # if we just ran configure without merging in the existing
    # config, we would lose existing config
    ExTwitter.configure(
      :process,
      Keyword.merge(
        ExTwitter.Config.get_tuples,
        [ access_token: access_token.oauth_token,
          access_token_secret: access_token.oauth_token_secret ]
      )
    )
    _user_info = ExTwitter.verify_credentials()
    changeset = conn |> create_auth_token_changeset(%{access_token: access_token.oauth_token,
      access_token_secret: access_token.oauth_token_secret})
    case Repo.insert_or_update(changeset) do
      {:ok, user} -> conn |> redirect(to: Router.Helpers.page_path(conn, :index, %{}))
      # { :error, changeset } ->
    end

    conn
    |> redirect(to: Router.Helpers.page_path(conn, :index, %{}))
  end

  def callback(conn, %{"denied" => _}) do
    conn
    |> redirect(to: Router.Helpers.page_path(conn, :index, %{}))
  end

  defp create_auth_token_changeset(conn, user_info) do
    current_user = Guardian.Plug.current_resource(conn)
    current_user
    |> build_assoc(:twitter_key)
    |> TwitterKey.changeset(user_info)
  end
end