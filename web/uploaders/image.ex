defmodule Datjournaal.Image do
  use Arc.Definition
  use Arc.Ecto.Definition

  @versions [:original]

  def __storage, do: Arc.Storage.Local

  # To add a thumbnail version:
  @versions [:original, :thumb]

  # Whitelist file extensions:
  def validate({file, _}) do
    ext_name = Path.extname(file.file_name) |> String.downcase
    ~w(.jpg .jpeg .gif .png) |> Enum.member?(ext_name)
  end

  # Define a thumbnail transformation:
  def transform(:thumb, _) do
    {:convert, "-strip -thumbnail 600x600^ -gravity center -auto-orient -extent 600x600 -format png", :png}
  end

  # Override the persisted filenames:
  def filename(version, {file, _}), do: "#{version}-#{file.file_name}"

  # Override the storage directory:
  # def storage_dir(version, {file, scope}) do
  #   "uploads/user/images/#{scope.id}"
  # end

  # Provide a default URL if there hasn't been a file uploaded
  def default_url(version, scope) do
    "/images/images/default_#{version}.png"
  end

  # Specify custom headers for s3 objects
  # Available options are [:cache_control, :content_disposition,
  #    :content_encoding, :content_length, :content_type,
  #    :expect, :expires, :storage_class, :website_redirect_location]
  #
  # def s3_object_headers(version, {file, scope}) do
  #   [content_type: Plug.MIME.path(file.file_name)]
  # end
end
