var credentials = require("./credentials.js"),
	Twit = require('twit'),
	twitterClient = new Twit(credentials.twitter);

twitterClient.get('statuses/user_timeline', { screen_name: 'vanarts', count: 2 },  function (err, data, response) {
	console.log(data)
});
