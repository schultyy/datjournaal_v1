use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :datjournaal, Datjournaal.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :comeonin, :bcrypt_log_rounds, 4
config :comeonin, :pbkdf2_rounds, 1

# Configure your database
config :datjournaal, Datjournaal.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "datjournaal_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
