var express = require('express');
var router = express.Router();

// custom modules
var fs      = require('fs');
var yaml    = require('js-yaml');

/* GET cards for reading. */
router.get('/reading/:spread/:card1/:card2/:card3', function(req, res, next) {

  var params = {
    title: 'Brackish Cards',
    reading: true,
    params: req.params,
    tarot: null,
    cards: [],
    card_decks: [],
    card_tokens: [],
    card_index: [],
    deck_tokens: ['rws', 'thoth', 'cbd', 'mary', 'brady'],
    questions: {
      'question': "How am I doing?",
      '1c': "❤️ <strong>Internal:</strong> How I feel.",
      '2c': "👋 <strong>Interpersonal:</strong> How my relationships feel.",
      '3c': "🌎 <strong>External:</strong> How the world feels.",
    },
    spreads: {
      'hru': {
        'current': '/',
        'next':    '/spread/whats-next'
      },
      'whats-next': {
        'current': '/spread/whats-next',
        'next':    '/'
      }
    }
  }

  try {
    // Load all the cards across all decks
    params['tarot'] = yaml.load(fs.readFileSync('./data/tarot.yaml', 'utf8'));
    // Load all the different decks and metadata about them
    params['decks'] = yaml.load(fs.readFileSync('./data/decks.yaml', 'utf8'));
    // All of the card tokens
    params['all_cards'] = Object.keys(params['tarot'])

    // Get 3 cards to display initially
    var card1_info = req.params['card1'].split('_')
    var card2_info = req.params['card2'].split('_')
    var card3_info = req.params['card3'].split('_')

    var card1 = params['tarot'][card1_info[1]]
    var card2 = params['tarot'][card2_info[1]]
    var card3 = params['tarot'][card3_info[1]]
    params['cards'].push(card1)
    params['cards'].push(card2)
    params['cards'].push(card3)
    params['card_decks'].push(card1_info[0])
    params['card_decks'].push(card2_info[0])
    params['card_decks'].push(card3_info[0])

    params['card_tokens'].push(card1_info[1])
    params['card_tokens'].push(card2_info[1])
    params['card_tokens'].push(card3_info[1])
    params['card_index'].push(card1['index'])
    params['card_index'].push(card2['index'])
    params['card_index'].push(card3['index'])
    console.log(params)
  } catch (e) {
    console.log('Error in reading.js try block: '+e);
  }

  // Spread and prompts
  // a: before flipping the card
  // b: after flipping the card
  // c: when permalinked
  spread = req.params['spread']
  if (spread) {
    if (spread == 'whats-next') {
      params['spread'] = 'whats-next'
      params['questions'] = {
      'question': "What's next?",
      'description': 'Three options for ways to think about what might be coming next.',
      '1c': "<strong>Option 1:</strong>",
      '2c': "<strong>Option 2:</strong>",
      '3c': "<strong>Option 3:</strong>",
    }      
    }
  } else {
    params['spread'] = 'hru'
  }

  res.render('reading', params);
});

module.exports = router;
