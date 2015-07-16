class SentimentsController < ApplicationController
  def index

  end

  def stream
    TwitterStream.start_stream(params[:search_term])
    render nothing: true
  end
end
