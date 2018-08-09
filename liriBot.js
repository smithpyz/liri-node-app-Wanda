var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var myRequest = require("request");
var FS = require("fs");

require("dotenv").config();

// liri.js can take in one of the following commands on the command line:
// argv[2] =
// 'my-tweets'
// 'spotify-this-song'
// 'movie-this'
// 'do-what-it-says'
// argv[3+] are parameters to argv[2]

var commands = [
  "'my-tweets'",
  "'spotify-this-song' <song name>",
  "'movie-this' <movie name>",
  "'do-what-it-says' [filename]   defaults to ./random.text'"
];

function usageMsg() {
  console.log("");
  console.log("Usage: node liriBot.js Request [request parameter]'");
  console.log("Valid requests:");
  for (let index = 0; index < commands.length; index++) {
    const element = commands[index];
    console.log("   " + (index + 1) + ") " + element);
  }
} // usageMsg

var argCnt = process.argv.length;
if (argCnt < 3) {
  usageMsg();
  console.log("Exiting ...");
  process.exit(1);
}

var commandStr = process.argv[2];
var parameterStr = "";

if (argCnt > 3) {
  parameterStr = process.argv.slice(3).join("+");
}
// else if (commandStr !== "do-what-it-says" && commandStr !== "my-tweets") {
//   console.log("Missing parameters ...");
//   usageMsg();
//   console.log("Exiting ...");
//   process.exit(1);
// }

console.log("Request:  " + commandStr + "  <" + parameterStr + ">");
// console.log();

doCommand(commandStr, parameterStr);

function doCommand(commandStr, parameterStr) {
  switch (commandStr) {
    case "my-tweets":
      twitterGet(parameterStr);
      break;
    case "spotify-this-song":
      if (!parameterStr) {
        parameterStr = "The Sign"; //by Ace of Base
      }
      spotifyGet(parameterStr);
      break;
    case "movie-this":
      if (!parameterStr) {
        console.log("'movie-this' missing movie name ...");
        usageMsg();
        break;
      }
      omdbGet(parameterStr);
      break;
    case "do-what-it-says":
      if (!parameterStr) {
        parameterStr = "./random.txt";
      }
      doCommandFile(parameterStr);
      break;
    default:
      console.log("Invalid request: " + commandStr + " '" + parameterStr + "'");
      usageMsg();
      console.log("Exiting ...");
      //  process.exit(1);
      break;
  }
} // doCommand

//console.log("Exiting ...");
// process.exit(0);

function omdbGet(movieName) {
  // Then run a request to the OMDB API with the movie specified
  let key = process.env.OMDB_API_KEY;
  let queryURL =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + key;
  // queryStr ="http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy"
  // console.log(queryURL);
  myRequest(queryURL, function (error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      let pbody = JSON.parse(body);
      // "{"Response":"False","Error":"Movie not found!"}"

      if (pbody.hasOwnProperty("Response") && pbody.Response == "True") {
        // * Title of the movie.
        console.log("'movie-this' Response >>>>>>>>>>>>>>>>>>>>>>>>> ");
        console.log("    Title: " + pbody.Title);
        // * Year the movie came out.
        console.log("    Year: " + pbody.Year);
        // * IMDB Rating of the movie.
        console.log("    imdbRating: " + pbody.imdbRating);
        for (let index = 0; index < pbody.Ratings.length; index++) {
          const element = pbody.Ratings[index];
          if (element.Source == "Rotten Tomatoes") {
            console.log(
              "    '" + element.Source + "' rating: " + element.Value
            );
          }
        }
        // * Rotten Tomatoes Rating of the movie.
        //

        // * Country where the movie was produced.
        console.log("    Country: " + pbody.Country);
        // * Language of the movie.
        console.log("    Language: " + pbody.Language);
        // * Plot of the movie.
        console.log("    Plot: " + pbody.Plot);
        // * Actors in the movie.
        console.log("    Actors: " + pbody.Actors);

        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<< End Response  ");
        // console.log(JSON.parse(body));
        // console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
      } else {
        if (pbody.hasOwnProperty("Error")) {
          console.log("Error: " + pbody.Error);
        }
      }
    } else {
      console.log(error);
    }
  });
} // movieInfo

function spotifyGet(parameterStr) {
  console.log("In spotifyGet " + parameterStr);
  //return;
  var spotify_key = {
    id: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_CLIENT_SECRET
  };

  var spotify = new Spotify({
    id: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_CLIENT_SECRET
  });

  spotify.search({ type: "track", query: parameterStr, limit: 5 }, function (
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    //console.log("SPOTIFY DATA SEARCH================");
    // console.log(data);
    for (let index = 0; index < data.tracks.items.length; index++) {
      const element = data.tracks.items[index];
      // console.log("=====element======" + index);
      // console.log(element);
      console.log("'spotify-this-song' Response >>>>>>>>>>>>>>>>>>>>>>>>> ");
      console.log("    Artists name: " + element.artists[0].name);
      console.log("    Song name: " + element.name);
      console.log("    Spotify preview link: " + element.external_urls.spotify);
      console.log("    Album name: " + element.album.name);
      console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<< End Response. Song # " + index);
    }
    // console.log(data.items);

    // Artist(s)

    //  * The song's name

    //  * A preview link of the song from Spotify

    //  * The album that the song is from
    // console.log(JSON.stringify(data));
    //console.log("end SPOTIFY DATA SEARCH================");
  });
} // end spotifyGet

function twitterGet() {
  console.log("In twitterGet " + parameterStr);

  var tclient_key = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };



  var tclient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  var params = { count: 20 };
  // tclient.get("direct_messages/events/list", function(error, tweets, response) {
  tclient.get("statuses/user_timeline", params, function (error, tweets, response) {
    if (error) throw JSON.stringify(error, null, 4);
    // console.log("TWEETS ===================");
    // console.log(JSON.stringify(tweets, null, 4)); // The favorites Now called likes.
    // console.log("RESPONSE =================");

    // console.log(JSON.stringify(response, null, 4)); // Raw response object.
    console.log("'my-tweets' Response >>>>>>>>>>>>>>>>>>>>>>>>> ");

    for (var index = 0; index < tweets.length; index++) {
      const element = tweets[index];
      console.log("    Msg: '" + element.text + "'     Created: " + element.created_at);
    }
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<< End Response  Cnt:" + index);

  });

  // tclient.post(
  //   "statuses/update",
  //   {
  //     status: "Hello World from Node. process id=" //+ process.pid
  //   },
  //   function(error, tweet, response) {
  //     if (error) throw JSON.stringify(error, null, 4);
  //     console.log(JSON.stringify(tweet, null, 4)); // Tweet body.
  //     console.log(JSON.stringify(response, null, 4)); // Raw response object.
  //   }
  // );

  // tclient.get("favorites/list", function(error, tweets, response) {
  //   if (error) throw JSON.stringify(error, null, 4);
  //   console.log("TWEETS ===================");
  //   console.log(JSON.stringify(tweets, null, 4)); // The favorites Now called likes.
  //   console.log("RESPONSE =================");

  //   console.log(JSON.stringify(response, null, 4)); // Raw response object.
  // });
} // end twitterGet

function doCommandFile(file) {
  console.log("In doCommandFile " + file);

  //fs.readFile(fileName, characterEncoding, callback )

  FS.readFile(file, "utf8", function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr);
    if (dataArr.length === 1) {
      doCommand(dataArr[0], "");
    } else {
      doCommand(dataArr[0], dataArr[1]);
    }
  });
} // end doCommandFile