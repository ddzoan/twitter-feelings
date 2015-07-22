class TwitterStream
  @@client = nil

  def self.start_stream(search_term, &deliverator)
    @@client = TweetStream::Client.new
    EM.run do
      @@client.track(search_term) do |status|
        p status.text
        deliverator.call(status.text)
      end
    end
  end

  def self.stop_stream
    @@client.stop
  end
end