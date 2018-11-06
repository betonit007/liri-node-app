//set environment variables with the dotenv package
require("dotenv").config();

//import keys.js
var keys = require("./keys.js");
var request = require("request");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

    //var spotify = new Spotify ({
    //   id: "2aaea950bc594fcc8943b2f0da0d08e8",
    //    secret: "2c5eae6afd4e444c8b9a85ed19f275e0"
   // });

var mode = process.argv[2];

var input = process.argv.slice(3).join(" ");

if (mode === 'concert-this') {
  
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

if (mode === 'spotify-this-song') {
    console.log('spotify');
  spotify
    .search({type: 'track', query: 'Jump' })
    .then (function(response) {
        
        console.log(response.tracks.items[19]);
    })
    .catch(function(err) {
        console.log(err);
    });
}

