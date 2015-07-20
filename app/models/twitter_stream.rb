class TwitterStream
  def self.start_stream(search_term, &deliverator)
    EM.run do
      TweetStream::Client.new.track(search_term) do |status|
        p status.text
        deliverator.call(status)
      end
    end
  end
end