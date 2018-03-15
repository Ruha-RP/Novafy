const express = require('express');
const Twitter = require('twitter');

// Init dotEnv
require('dotenv').config();

// Twitter API 
const sijui = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let tweets_arr = [];    // Creating an array to hold only the tweets we need

const params = {    // Setting up the query paramaters
    q: 'news', // Query Search
    lang: 'ENG',    // Language
    count: 5 // Number of results
};

sijui.get('search/tweets', params, function(error, data, response) {    // Search the Tweets
    let tweets = data.statuses;
    for(let i = 0; i < tweets.length; i++) {    // Loop through all the tweets
        tweets_arr.push(tweets[i].text);    // Push the text of the tweet to the array
        //console.log(`NUMBER ${i} ::: ${tweets[i].text}`);   // Display in (server) console log for debugging
    }
    
});

// Let the tweets_arr to available to other files
module.exports = tweets_arr;
