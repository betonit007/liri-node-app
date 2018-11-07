//set environment variables with the dotenv package
require("dotenv").config();

//import keys.js
var keys = require("./keys.js");
var request = require("request");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');


var mode = process.argv[2];

var input = process.argv.slice(3).join(" ");

if (mode === 'concert-this') {
  
    concert();
}

if (mode === 'spotify-this-song') {
    spotifyThis();
}

if (mode === 'movie-this') {
    movieThis();
}

if (mode === 'do-what-it-says') {

    fs.readFile("random.txt", "utf8", function(err, data) {
      if (err) {
          return console.log(err);
      }
      var where = data.indexOf(",");
      var what = data.slice(0, where);
      input = data.slice((where + 2), (data.length-1));
      if (what === 'concert-this') {
          concert();
      }
      if (what === 'spotify-this-song') {
          spotifyThis();
      }
      if (what === 'movie-this') {
          movieThis();
      }
    });
}


///////////////Functions/////////////////////////////////////////////////////////////////////////////


function concert() {
    request("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function(err, res, body) {
            if (err) {
                console.log(err);
            }
            
            else {
                var res = JSON.parse(body);
                //console.log(res.length);
                var i = 0;


                if (res[0]) {
                    console.log("\n" + res[i].lineup[0] + " will be appearing at: ");
                    while (res[i]) {

                        var venueDate = moment(res[i].datetime).format('MM/DD/YYYY');

                        if (res[i].venue.region === '') {
                        console.log("\n"  + res[i].venue.name + " in " + res[i].venue.city + ", " + res[i].venue.country + " on " + venueDate + ".");
                        
                        }
                        else {
                        console.log("\n" +  res[i].venue.name + " in " + res[i].venue.city + ", " + res[i].venue.region + " on " + venueDate + ".");
                    
                        }
                        i++;
                    }
                }
                else {
                    console.log("\nNo results found for " + input + ", please revise your search and try again.");
                }
        }

        });
 }

 function spotifyThis() {
    var i = 0;
    if (!input) {
        input = "Ace of Base";
    }
    spotify
      .search({type: 'track', query: input })
      .then (function(response) {
          if (response.tracks.items.length === 0) {
              console.log("\nSorry, no results found. Please revise your search.")
          }
          else {
              console.log("\nArtist: " + response.tracks.items[0].artists[0].name);
              console.log("\nSong Name: " + response.tracks.items[0].name)
              if (response.tracks.items[0].preview_url) {
              console.log("\nPreview Link: " + response.tracks.items[0].preview_url);
              }
              else {
                  console.log("\nPreview Link: Not Available.");
              }
              console.log("\nAlbum: " + response.tracks.items[0].album.name);
          }
      })
      .catch(function(err) {
          console.log(err);
      });
 }

 function movieThis() {
    if (input.length === 0) {
        input = "Mr. Nobody";
    }
    request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        
        //console.log((JSON.parse(body).Response)); //Valid response or not
         if(JSON.parse(body).Response === 'False') {
             console.log("\nSorry, no results found. Please revise your search.");
         }     

         else if(!error && response.statusCode === 200) {
            console.log("\nTitle: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("\nPlot: " + JSON.parse(body).Plot);
            
        }
    });
 }