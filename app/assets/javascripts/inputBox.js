$(function() {
    myApp = {};
    myApp.successCallback = function (data) { console.log('hi'); };
    myApp.ajaxParams = {
        success: myApp.successCallback
    };
    myApp.executeSubmission = function (e) {
        e.preventDefault();
        var val = $('input').val();
        myApp.ajaxParams.url = '/sentiments/' + val;
        $.ajax(myApp.ajaxParams);
    };
    $('#query').submit(myApp.executeSubmission);
});