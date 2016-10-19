defmodule Datjournaal.Router do
  use Datjournaal.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]

    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/api", Datjournaal do
    pipe_through :api
      scope "/v1" do
        post "/sessions", SessionController, :create
        delete "/sessions", SessionController, :delete
        get "/current_user", CurrentUserController, :show
        resources "posts", PostController, only: [:index, :show, :create]
        resources "user_stats", UserStatsController, only: [:index]
        post "/posts/:id/hide", PostController, :hide
        post "/posts/:id/show", PostController, :show_post
    end
  end

  scope "/", Datjournaal do
    pipe_through :browser # Use the default browser stack

    get "*path", PageController, :index
  end
end
