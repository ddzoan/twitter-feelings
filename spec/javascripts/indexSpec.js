var fixture, input, button, request;
describe('index page', function() {
    beforeEach(function() {
        fixture = setFixtures('<form id="query">' +
                                '<input type="text" class="search"/>' +
                                '<button class="submit">Submit</button>' +
                                '</form>' +
                                '<div class="score"></div>' +
                                '<ul class="tweet-stream"></ul>');
        input = fixture.find('input');
        button = fixture.find('button');
        spyOn(myApp, 'eventSource').and.returnValue({addEventListener: $.noop});
    });

    describe('submit button', function() {
        const value = "whatever";
        beforeEach(function() {
            input.val(value);
        });

        it("prevents default activity cascade", function () {
            var eventSpy = {preventDefault: jasmine.createSpy('event')};
            myApp.executeSubmission(eventSpy);
            expect(eventSpy.preventDefault).toHaveBeenCalled();
        });

        it("wont send a request if the input box is empty", function() {
            input.val('');
            myApp.executeSubmission({preventDefault: $.noop});
            expect(myApp.eventSource).not.toHaveBeenCalled();
        });

        it("makes an event source to the proper endpoint", function() {
            myApp.executeSubmission({preventDefault: $.noop});
            expect(myApp.eventSource).toHaveBeenCalledWith('/sentiments/' + value);
        })

    });

    describe('new tweet event', function() {
        const eventData = {data: "{\"score\": 2.5, \"text\": \"Love it\"}"};

        afterEach(function(){
            myApp.tweetCount = 0;
            myApp.totalScore = 0;
        });

        it('increases tweet count', function () {
            expect(myApp.tweetCount).toBe(0);
            myApp.newTweet(eventData);
            expect(myApp.tweetCount).toBe(1);
        });

        it('changes the total score', function () {
            expect(myApp.totalScore).toBe(0);
            myApp.newTweet(eventData);
            expect(myApp.totalScore).toBe(2.5);
        });

        it('changes the score div', function () {
            expect($('.score').text()).toBe('');
            myApp.newTweet(eventData);
            expect($('.score').text()).toBe('250.0000');
        });

        describe('tweetstream', function() {

            it('will add the tweet text to the tweetstream', function() {
                expect($('.tweet-stream li').length).toBe(0);
                myApp.newTweet(eventData);
                expect($('.tweet-stream li').length).toBe(1);
                myApp.newTweet(eventData);
                expect($('.tweet-stream li').length).toBe(2);
            });

            it('only shows a max of 10 tweets', function() {
                for (var i=0; i<10; i++) {
                    myApp.newTweet(eventData);
                }
                expect($('.tweet-stream li').length).toBe(10);
                myApp.newTweet(eventData);
                expect($('.tweet-stream li').length).toBe(10);
            });
        });




    });

});