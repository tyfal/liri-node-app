var Spotify = require('node-spotify-api');
var moment = require('moment');
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var inquirer = require('inquirer');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);


/**
 * Creates an instance of the Liri Node App.
 *
 * @class Media
 */
class Media {

    /**
     * Creates an instance of Media and initializes handler.
     * 
     * @memberof Media
     */
    constructor() {

        this.action = process.argv[2];

        this.media = process.argv.slice(3).join(" ");

        this.Handler();

    }

    /**
     * Uses switch statement based off of input to call methods.
     *
     * @memberof Media
     */
    Handler() {

        switch (this.action) {

            case "concert-this":

                this.BandsInTown();

                break;

            case "spotify-this":

                this.Spotify();

                break;

            case "movie-this":

                this.OMDB();

                break;

            case "do-what-it-says":

                this.DoWhatItSays();

                break;

            default:

                inquirer.prompt([

                    {
                        type: "rawlist",
                        message: "choose a valid action: ",
                        name: "action",
                        choices: [
                            { name: "concert-this" },
                            { name: "spotify-this" },
                            { name: "movie-this" },
                            { name: "do-what-it-says" }
                        ]
                    }, {
                        type: "input",
                        message: "type in a valid media: ",
                        name: "media",
                        default: ""
                    }

                ]).then(answer => {
                    this.action = answer.action;
                    this.media = answer.media;
                    this.Handler();
                })

        }

    }

    /**
     * Gets the IMDB information for movie inputs.
     *
     * @memberof Media
     */
    OMDB() {

        var _self = this;

        if (this.media === '') this.media = "Mr. Nobody";

        axios.get(`http://www.omdbapi.com/?t=${this.media.replace(" ", "+")}&y=&plot=short&apikey=trilogy`).then(
            function (response) {
                // Then we print out the imdbRating
                try {
                    // console.log(response.data)
                    if (response.data.imdbRating !== undefined) console.log(`title: ${response.data.Title}\nyear: ${response.data.Year}\nIMDB rating: ${response.data.imdbRating}\nRotton Tomatoes rating: ${response.data.Ratings[1].Value}\nproduced in: ${response.data.Country}\nlanguage: ${response.data.Language}\nplot: ${response.data.Plot}\nactors: ${response.data.Actors}`);
                    else throw "movie could not be found";
                }
                catch (err) {
                    console.log(err);
                    _self.action = '';
                    _self.media = '';
                    _self.Handler();
                }
            }
        );

    }

    /**
     * Gets the track information for song input.
     *
     * @memberof Media
     */
    Spotify() {

        var _self = this;

        if (this.media === '') this.media = "The Sign Ace the Base";

        spotify.search({ type: 'track', query: this.media }, function (err, data) {

            try {
                if (!err) console.log(`song name: ${data.tracks.items[0].name}\nsong by: ${data.tracks.items[0].artists[0].name}\npreview link: ${data.tracks.items[0].href}\nalbum name: ${data.tracks.items[0].album.name}`);
                else throw err;
            }
            catch (err) {
                console.log('Error occurred: ' + err);
                _self.action = '';
                _self.media = '';
                _self.Handler();
            }

        });

    }

    /**
     * Gets the concert information for band inputs.
     *
     * @memberof Media
     */
    BandsInTown() {

        var _self = this;

        axios.get(`https://rest.bandsintown.com/artists/${this.media}/events?app_id=codingbootcamp`).then(
            function (response) {
                // Then we print out the imdbRating
                // console.log(response.data[0]);
                try {
                    if (response !== undefined) console.log(`${_self.media} is playing at ${response.data[0].venue.name} (${response.data[0].venue.city}, ${response.data[0].venue.region})\nDate of event: ${moment(response.data[0].datetime).format( "MM/DD/YYYY")}`);
                    else throw "artist could not be found";
                }
                catch (err) {
                    console.log(err);
                    _self.action = '';
                    _self.media = '';
                    _self.Handler();
                }
            }
        );

    }

    /**
     * Reads the file to get random input and return track info.
     *
     * @memberof Media
     */
    DoWhatItSays() {

        var _self = this;

        // This block of code will read from the "movies.txt" file.
        // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
        // The code will store the contents of the reading inside the variable "data"
        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            _self.media = data.split(",")[1];

            _self.Spotify()

        });

    }


}

new Media();

