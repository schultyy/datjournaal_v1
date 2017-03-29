defmodule Datjournaal.Session do
  alias Datjournaal.{Repo, User}
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

end
