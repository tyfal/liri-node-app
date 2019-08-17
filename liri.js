var Spotify = require('node-spotify-api');
var moment = require('moment');
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);


class Media {

    constructor() {

        this.action = process.argv[2];

        this.media = process.argv.slice(3).join(" ");

        // console.log(`\nYou chose to ${action} with ${media}\n`);

        this.Handler();

    }

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
                            {name:"concert-this"},
                            {name:"spotify-this"},
                            {name:"movie-this"},
                            {name:"do-what-it-says"}
                        ]
                    }, {
                        type: "input",
                        message: "type in a valid media: ",
                        name: "media"
                    }

                ]).then(answer => {
                    this.action = answer.action;
                    this.media = answer.media;
                    this.Handler();
                })

        }

    }

    OMDB() {

        axios.get(`http://www.omdbapi.com/?t=${this.media.replace(" ","+")}&y=&plot=short&apikey=trilogy`).then(
            function (response) {
                // Then we print out the imdbRating
                console.log("The movie's rating is: " + response.data.imdbRating);
            }
        );

    }

    Spotify() {

        

    }

    BandsInTown() {



    }

    DoWhatItSays() {



    }


}

new Media();

