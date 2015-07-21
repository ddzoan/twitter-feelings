myApp = {};
myApp.successCallback = function (data) {
    console.log('success');
};
myApp.eventSource = function(path) {
    return new EventSource(path);
};
myApp.addTweet = function(tweetData) {
    if($('.tweet-stream li').length === 10) {
        $('.tweet-stream li:last-child').remove();
    }
    $('.tweet-stream').prepend($('<li class="tweet">' + tweetData.text + '</li>'));
};
myApp.updateScore = function(tweetData) {
    myApp.tweetCount += 1;
    myApp.totalScore += tweetData.score;
    $('.score').text(((myApp.totalScore / myApp.tweetCount)*100).toFixed(4));
};
myApp.tweetCount = 0;
myApp.totalScore = 0;
myApp.newTweet = function(event) {
    var tweetData = JSON.parse(event.data);
    myApp.updateScore(tweetData);
    myApp.addTweet(tweetData);
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