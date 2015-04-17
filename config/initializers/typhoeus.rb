class Cache
  def initialize
    @client = Dalli::Client.new
  end

  def get(request)
    @client.get(request.cache_key)
  end

  def set(request, response)
    @client.set(request.cache_key, response)
  end
end

Typhoeus::Config.cache = Cache.new
