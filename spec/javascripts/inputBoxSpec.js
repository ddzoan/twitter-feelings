var fixture, input, button, request;
describe('index page', function() {
    beforeEach(function() {
        jasmine.Ajax.install();
        fixture = setFixtures('<input type="text" /> <button class="submit">submit</button>');
        input = fixture.find('input');
        button = fixture.find('button');
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    describe('submit button', function() {
        const value = "whatever";
        beforeEach(function() {
            input.val(value);
        });

        it("onclick sends a request", function() {
            spyOn($, 'ajax');
            myApp.executeSubmission({preventDefault: $.noop});
            expect($.ajax.calls.first().args[0].success).toBe(myApp.successCallback);
        });

        it("prevents default activity cascade", function () {
            var eventSpy = {preventDefault: jasmine.createSpy('event')};
            myApp.executeSubmission(eventSpy);
            expect(eventSpy.preventDefault).toHaveBeenCalled();
        });

        it("sends a request to the correct url", function() {
            spyOn($, 'ajax');
            myApp.executeSubmission({preventDefault: $.noop});
            expect($.ajax.calls.first().args[0].url).toBe('/sentiments/' + value);
        });

        it("wont send a request if the input box is empty",function() {
            spyOn($, 'ajax');
            input.val('');
            myApp.executeSubmission({preventDefault: $.noop});
            expect($.ajax).not.toHaveBeenCalled();
        });

    });

});