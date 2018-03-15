const express = require('express');
const router = express.Router();
const sijuiTwitter = require('../required/twitter');

// Init Express App
const app = express();

// Routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));    // Render the page with the tweets_arr
    //console.log(sijuiTwitter);
});

router.get('/givemeTweet', (req, res) => {
    res.send(sijuiTwitter);  
})

// Make this file available to import from other files
module.exports = router;