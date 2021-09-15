var express = require('express');
var router  = express.Router();

// custom modules
var fs      = require('fs');
var yaml    = require('js-yaml');

/* GET home page. */
router.get('/', function(req, res, next) {

  var params = {
    title: 'Brackish Cards',
    tarot: null,
    cards: [],
    card_tokens: [],
    card_index: [],
    deck_tokens: ['rws', 'thoth', 'cbd', 'mary', 'brady']
  }

  try {
    // Load all the cards across all decks
    params['tarot'] = yaml.load(fs.readFileSync('./data/tarot.yaml', 'utf8'));
    // Load all the different decks and metadata about them
    params['decks'] = yaml.load(fs.readFileSync('./data/decks.yaml', 'utf8'));
    // All of the card tokens
    params['all_cards'] = Object.keys(params['tarot'])

    // Get 3 cards to display initially
    while (params['cards'].length < 3) {
      var random_index = Math.floor(Math.random() * 78)
      var card = params['tarot'][params['all_cards'][random_index-1]]
      if (!params['cards'].includes(card)) {
        params['cards'].push(card)
        params['card_tokens'].push(params['all_cards'][random_index-1])
        params['card_index'].push(random_index-1)
      }
    }
  } catch (e) {
    console.log('Error: '+e);
  }

  res.render('index', params);
});

module.exports = router;
