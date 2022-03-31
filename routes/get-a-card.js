// Discord webhook
// https://discord.com/api/webhooks/959154704754020372/3IvfTGTeNl7Z8G7FJbtSGzQitJqF0MUtOjsWF5AcmgMN8ixSXp7eEGAsTVwjsFsqpi_l

var express = require('express');
var router = express.Router();

// custom modules
var fs      = require('fs');
var yaml    = require('js-yaml');

/* GET users listing. */
router.get('/get-a-card', function(req, res, next) {
  var params = {
  	test: '1',
  	tarot: null,
  	decks: null,
  	all_cards: null,
  	cards: [],
  	card_tokens: [],
  	card_index: [],
    deck_tokens: ['rws', 'thoth', 'cbd', 'mary', 'brady', 'cosma']
  }

  // Load all the cards across all decks
  params['tarot']     = yaml.load(fs.readFileSync('./data/tarot.yaml', 'utf8'));
  // Load all the different decks and metadata about them
  params['decks']     = yaml.load(fs.readFileSync('./data/decks.yaml', 'utf8'));
  // All of the card tokens
  params['all_cards'] = Object.keys(params['tarot'])
  // Get 3 cards to display initially
  while (params['cards'].length < 3) {

  	// Pick a card
    var random_index  = Math.floor(Math.random() * 78)
    var card          = params['tarot'][params['all_cards'][random_index]]
    card['token']     = params['all_cards'][random_index]

    // Pick a deck
    var random_deck_num = Math.round(Math.random() * 5)
    card['deck_token']  = params['deck_tokens'][random_deck_num]

    // Card URL
    card['image']     = 'https://brackish.s3.us-west-1.amazonaws.com/' + card['decks'][card['deck_token']]['image']
    card['deck_link']  = params['decks'][card['deck_token']]['link']

    if (!params['cards'].includes(card)) {
      params['cards'].push(card)
      params['card_tokens'].push(params['all_cards'][random_index])
      params['card_index'].push(random_index)
    }
  }

  console.log(params)
  res.render('get-a-card', params);
});

module.exports = router;
