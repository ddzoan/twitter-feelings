class SentimentsController < ApplicationController
  include ActionController::Live

  def index
  end

  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    analyzer = Sentimental.new
    sse = SSE.new(response.stream)
    TwitterStream.start_stream(params[:search_term]) do |tweet|
      score = analyzer.get_score(tweet)
      sse.write({score: score, text: tweet}, event: 'new_tweet')
    end
    render nothing: true
  end
end
