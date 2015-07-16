require 'rails_helper'

RSpec.describe SentimentsController, type: :controller do

  describe 'GET index' do
    it 'renders the index template' do
      get :index
      expect(response).to render_template('index')
    end
  end

  describe 'stream' do
    it 'calls #start_stream' do
      allow(TwitterStream).to receive(:start_stream)

      get :stream, search_term: 'hello'
      expect(TwitterStream).to have_received(:start_stream).with('hello')
    end
  end
end
