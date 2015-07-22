class SentimentsController < ApplicationController
  include ActionController::Live

  def index
  end

  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    analyzer = Sentimental.new
    sse = SSE.new(response.stream)

    begin
      TwitterStream.start_stream(params[:search_term]) do |tweet|
        score = analyzer.get_score(tweet)
        sse.write({score: score, text: tweet}, event: 'new_tweet')
      end
    rescue ClientDisconnected
      puts 'client disconnected!!!!! :(((('
    ensure
      sse.close
    end

    render nothing: true
  end

  def stop_stream
    TwitterStream.stop_stream
    render nothing: true
  end
end
