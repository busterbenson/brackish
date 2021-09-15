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
    card_tokens: []
  }

  try {
    // Load 3 tarot cards
    params['tarot'] = yaml.load(fs.readFileSync('./data/tarot.yaml', 'utf8'));
    params['decks'] = yaml.load(fs.readFileSync('./data/decks.yaml', 'utf8'));
    var all_cards = Object.keys(params['tarot'])
    while (params['cards'].length < 3) {
      var random_index = Math.floor(Math.random() * 78)
      var card = params['tarot'][all_cards[random_index-1]]
      if (!params['cards'].includes(card)) {
        params['cards'].push(card)
        params['card_tokens'].push(all_cards[random_index-1])
      }
    }
  } catch (e) {
    console.log('Error: '+e);
  }

  res.render('index', params);
});

module.exports = router;
