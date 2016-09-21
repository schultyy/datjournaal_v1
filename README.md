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
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

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

Generate two secrets via `mix phoenix.gen.secret`. Then open `config/prod.secret.exs` and paste that secret for `secret_key_base` and `secret_key`. Also paste in the password for the database user:

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
