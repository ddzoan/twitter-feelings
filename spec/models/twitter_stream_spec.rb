require 'rails_helper'

RSpec.describe TwitterStream do

  describe '#start_stream' do
    let(:client) { double(:stream_client, track: nil) }
    before do
      allow(TweetStream::Client).to receive(:new).and_return(client)
      allow(EM).to receive(:run) {|&block| block.call }
    end


    it 'starts a twitter stream' do
      TwitterStream.start_stream('hello')

      expect(client).to have_received(:track).with('hello')
    end
  end

  describe '#stop_stream' do
    let(:client) { double(:stream_client, stop: nil, track: nil) }
    before do
      allow(TweetStream::Client).to receive(:new).and_return(client)
      allow(EM).to receive(:run) {|&block| block.call }
    end

    it 'stops the twitter stream' do
      TwitterStream.start_stream('hello')
      TwitterStream.stop_stream

      expect(client).to have_received(:stop)
    end
  end
end
