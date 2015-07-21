myApp = {};
myApp.successCallback = function (data) {
    console.log('success');
};
myApp.eventSource = function(path) {
    return new EventSource(path);
};
myApp.tweetCount = 0;
myApp.totalScore = 0;
myApp.newTweet = function(event) {
    myApp.tweetCount += 1;
    myApp.totalScore += JSON.parse(event.data).score;
    $('.score').text(((myApp.totalScore / myApp.tweetCount)*100).toFixed(4));
};
myApp.ajaxParams = {
    success: myApp.successCallback
};
myApp.executeSubmission = function (e) {
    e.preventDefault();
    var val = $('input').val();

    if(val) {
        var source = myApp.eventSource('/sentiments/' + val);
        source.addEventListener('new_tweet', myApp.newTweet);
    }
    else {console.log('please enter input');}

};

$(function() {
    $('#query').submit(myApp.executeSubmission);
});