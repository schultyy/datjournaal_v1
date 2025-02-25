# Datjournaal

## Requirements

- Elixir
- Erlang
- Postgres >= 9.4
- Imagemagick
- Node.js 4.4.x
- npm 3.x


## Development

To start your Phoenix app:

  * Install dependencies with `mix deps.get`
  * Install JS dependencies with `npm install`
  * Copy over dev config `cp config/dev.exs.example config/dev.exs`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Docker

Install Docker on your machine.

In `config/dev.exs` change the hostname to `postgres`:

```elixir
config :datjournaal, Datjournaal.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "datjournaal_dev",
  hostname: "postgres",
  pool_size: 10
```

Then:

```
# Build the Docker image and start the `web` container, daemonized
$ docker-compose up -d web
```

```
# Install application's dependencies and compile them all
$ docker-compose run web mix do deps.get, compile
```

```
# Create database and run migrations
$ docker-compose run web mix ecto.create
$ docker-compose run web mix ecto.migrate
```

```
# Install (mostly) JS dependencies through `npm`
$ docker-compose run web npm install
```

```
# Execute the seeding script, if needed
$ docker-compose run web mix run priv/repo/seeds.exs
```

```
# Restart the `web` container to ensure everything's up
$ docker-compose restart web
```

Then check your browser at `http://dev:4000`

### Tests

```
# Execute all tests (It's a `$ mix test` actually)
$ docker-compose run test
```

## Deployment

Clone the application into the home directory. Then `cd` into it.

At first, install all JS dependencies:

```bash
$ npm install
```

Then install all Elixir production dependencies:

```bash
$ MIX_ENV=prod mix do deps.get
```

Generate two secrets via `mix phoenix.gen.secret`. Then open `config/prod.secret.exs` and paste that secret for `secret_key_base` and `secret_key`. Also paste in the password for the database user. Get your Twitter secrets here: https://apps.twitter.com/app/12906694/keys

```elixir
use Mix.Config

config :datjournaal, Datjournaal.Endpoint,
  secret_key_base: "<YOUR KEY HERE>"

config :guardian, Guardian,
  secret_key: "<OTHER KEY HERE>"

config :datjournaal, Datjournaal.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "datjournaal",
  password: "<DB PASSWORD HERE>",
  database: "datjournaal_production",
  hostname: "localhost",
  pool_size: 10

config :extwitter, :oauth, [
   consumer_key: "<YOUR CONSUMER KEY>",
   consumer_secret: "<YOUR CONSUMER SECRET>",
   access_token: "<YOUR ACCESS TOKEN>",
   access_token_secret: "<YOUR ACCESS TOKEN SECRET>"
]
```

To release the app, run the following commands:

```bash
$ MIX_ENV=prod mix compile
$ NODE_ENV=production node_modules/webpack/bin/webpack.js
$ MIX_ENV=prod mix phoenix.digest
$ MIX_ENV=prod mix ecto.migrate
$ MIX_ENV=prod mix release
$ cp rel/datjournaal/releases/0.0.1/datjournaal.tar.gz /var/apps/datjournaal/
$ cd /var/apps
$ tar xfz datjournaal.tar.gz -C datjournaal
$ rm datjournaal.tar.gz
```

### Create a user

Since sign up is disabled in the application itself, a user needs to be created via the mix shell. Login into the machine, cd into the application directory,
and run:

```bash
$ bin/datjournaal remote_console
iex(1)> handle = "schultyy"
iex(2)> email = "jan@unexpected-co.de"
iex(3)> password = "<PASSWORD>"
iex(4)> ch = Datjournaal.User.changeset(%Datjournaal.User{},%{handle: handle, email: email, password: password})
iex(5)> Datjournaal.Repo.insert(ch)
```
