require 'rails_helper'

RSpec.describe SentimentsController, type: :controller do

  describe 'GET index' do
    it 'renders the index template' do
      get :index
      expect(response).to render_template('index')
    end
  end

  describe 'GET stream' do
    it 'calls #start_stream' do
      allow(TwitterStream).to receive(:start_stream)
      get :stream, search_term: 'hello'
      expect(TwitterStream).to have_received(:start_stream).with('hello')
    end

    it 'assigns a sentimental value to incoming tweets' do
      analyzer = instance_double('Sentimental')
      allow(Sentimental).to receive(:new).and_return(analyzer)
      allow(analyzer).to receive('get_score')
      allow(TwitterStream).to receive(:start_stream) {|&block| block.call('Love it')}

      get :stream, search_term: 'Love it'
      expect(analyzer).to have_received(:get_score).with('Love it')
    end

    it 'writes the sentiment score to the new_tweet event' do
      tweet = 'Love it'
      tweet_score = 5
      analyzer = instance_double('Sentimental')
      allow(Sentimental).to receive(:new).and_return(analyzer)
      allow(analyzer).to receive('get_score').and_return(tweet_score)

      sse = instance_double('SSE')

      allow(sse).to receive('write')
      allow(ActionController::Live::SSE).to receive(:new).and_return(sse)
      allow(TwitterStream).to receive(:start_stream) {|&block| block.call(tweet)}

      get :stream, search_term: tweet
      expect(sse).to have_received(:write).with({text: tweet, score: tweet_score}, event: 'new_tweet')
    end
  end

  describe 'GET stop_stream' do
    it 'stops the twitter stream' do
      allow(TwitterStream).to receive(:stop_stream)
      get :stop_stream
      expect(TwitterStream).to have_received(:stop_stream)
    end
  end
end
