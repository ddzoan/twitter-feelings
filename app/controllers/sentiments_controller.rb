class SentimentsController < ApplicationController
  def index
  end

  def stream
    analyzer = Sentimental.new
    TwitterStream.start_stream(params[:search_term]) do |tweet|
      analyzer.get_score(tweet)
    end
    render nothing: true
  end
end
