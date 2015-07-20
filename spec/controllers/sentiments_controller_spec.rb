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
      allow(analyzer).to receive('get_sentiment')
      allow(TwitterStream).to receive(:start_stream) {|&block| block.call('Love it')}

      get :stream, search_term: 'Love it'
      expect(analyzer).to have_received(:get_sentiment).with('Love it')
    end
  end
end
