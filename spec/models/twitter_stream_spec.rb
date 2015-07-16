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
end
