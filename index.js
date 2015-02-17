//By http://hapijs.com/
var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost', 
    port: 8000
});

// Start the server
server.start(function(){
	console.log("Server running at "+server.info.uri);
});

server.route ({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: "public",
			listing: true,
			index: false
		}
	}
});
server.route ({
	method: 'GET',
	path: '/shared/{param*}',
	handler: {
		directory: {
			path: "shared",
			listing: true,
			index: false
		}
	}
});

// Using a template with hapi-dust
server.views({
	engines: {html:require('hapi-dust')},
	path: __dirname + "/dust_templates"
});

server.route({
    method: 'GET',
    path:'/quiz',
    handler: function (request, reply) {
    	//get credentials
    	var credentials = require('./credentials.js'),
		flickrQueryString = {
    	    		"method": 'flickr.photos.search',
    	    		"api_key": credentials.flickr.api_key,
    	    		"tags": 'vancouver',
    	    		"format": 'json',
    	    		"nojsoncallback": 1
    	    	},
		httpRequest = require('request');

    	//request to flickr
		httpRequest({
			method: 'GET',
			url: 'https://api.flickr.com/services/rest/',
			qs: flickrQueryString,
			json: "true"
		}, 
    	//get response by frickr
		function (error, incomingMessage, response) {
			if (!error && incomingMessage.statusCode == 200) {
				var photos = response.photos.photo,
				flickrArray = [], flickerUri,
				resultArray = [], resCode,
				facebookArray = [], facebookUri,
				twitterArray = [], tweetTxt;

				// produce flickr photo uri
				photos.forEach(function(photo, idx){
					flickerUri = "https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
					if(idx<4) {
						flickrArray.push({"uri": flickerUri, "index": idx});
					} else if(idx<64+4) {
						// generate quaternary code
						resCode = ('00'+((idx-4).toString(4))).slice(-3);
						resultArray.push({"result": flickerUri, "resCode": resCode});
					}
				});

				// TODO: I don't like nested...
				//get response by facebook.
				var endpoint = "http://graph.facebook.com/", id = "vancouver.institute.of.media.arts", 
				facebookHttpRequest = require('request');
				facebookHttpRequest({
					method: 'GET',
					url: endpoint+id+'/photos',
					json: "true"
				},
				function(error, incomingMessage, response){
		        	var likers = response.data[0].likes.data;
		        	likers.forEach(function(liker, index){
		        		if(index<4) {
			        		facebookUri = endpoint+liker.id+'/picture';
			        		facebookArray.push({"fb": facebookUri, "index": index});		        			
		        		}
		        	});

					// TODO: Nested Ansync. I don't like this.
					//get response by twitter.
					var Twit = require('twit'),
					twitterClient = new Twit(credentials.twitter);
					twitterClient.get('statuses/user_timeline', { screen_name: 'vanarts', count: 4 },  function (err, data, response) {
						data.forEach(function(record, idx){
							tweetTxt = record.text;
							twitterArray.push({"tweet": tweetTxt, "tweetDate": record.created_at, "index": idx});
						});
						//Using template
						reply.view('./tmplProject.html',{"photos": flickrArray, "twt": twitterArray, "facebook": facebookArray, "results": resultArray});
					});
				});
			}
		});
    }
});