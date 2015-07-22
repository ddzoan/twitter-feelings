myApp = {};
myApp.successCallback = function (data) {
    console.log('success');
};
myApp.createEventSource = function(path) {
    myApp.eventSource = new EventSource(path);
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
        myApp.createEventSource('/sentiments/' + val);
        myApp.eventSource.addEventListener('new_tweet', myApp.newTweet);
    }
    else {console.log('please enter input');}

};
myApp.stopStream = function (e) {
    myApp.eventSource.close();
    $.ajax({
        url: '/stop_stream'
    });
};

$(function() {
    $('#query').submit(myApp.executeSubmission);
    $('.stop-stream').click(myApp.stopStream);
});