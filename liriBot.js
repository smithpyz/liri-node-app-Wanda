require('dotenv').config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
const fs = require('fs');

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var commands = [
  "'my-tweets'",
  "'spotify-this-song' <song name>",
  "'movie-this' <movie name>",
  "'do-what-it-says'"
];

// Create an empty string for holding liriBot's response to command
var liriResponse = "";

// Capture all var command arguments (again ignoring the first two Node arguments, index0 & index1)
var nodeArgs = commands.argv;
for (var i = 2; i < nodeArgs.length; i++) {
  liriResponse = "Liri Bot says: " + liriResponse + nodeArgs[i];
}

console.log(liriResponse);


request('https://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});

var Tclient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {
  screen_name: 'nodejs',
  count: 20
};
Tclient.get('statuses/user_timeline', params, function (error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});