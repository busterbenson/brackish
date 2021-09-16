var express = require('express');
var router  = express.Router();

// custom modules
var fs      = require('fs');
var yaml    = require('js-yaml');

/* GET home page. */
router.get(['/','/spread/:spread'], function(req, res, next) {
  var params = {
    title: 'Brackish Cards',
    tarot: null,
    cards: [],
    card_tokens: [],
    card_index: [],
    deck_tokens: ['rws', 'thoth', 'cbd', 'mary', 'brady'],
    questions: {
      'question': "How are you doing?",
      '1a': "❤️ <strong>Internal:</strong> Click on this card as you think about how you feel right now.",
      '1b': "❤️ <strong>Internal:</strong> <a href='' class='reloadcard' id='reloadcard_1'>Flip through cards</a> until a card matches how you feel <strong>emotionally</strong> right now.",
      '2a': "👋 <strong>Interpersonal:</strong> Click on this card as you think about how your relationships with others feel right now.",
      '2b': "👋 <strong>Interpersonal:</strong> <a href='' class='reloadcard' id='reloadcard_2'>Flip through cards</a> until a card matches how your <strong>relationships with others</strong> feel right now.",
      '3a': "🌎 <strong>External:</strong> Click on this card as you think about how the world is feeling right now.",
      '3b': "🌎 <strong>External:</strong> <a href='' class='reloadcard' id='reloadcard_3'>Flip through cards</a>until a card matches how <strong>the world</strong> feels right now.",
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
      '1a': "<strong>Option 1:</strong>",
      '1b': "<strong>Option 1:</strong> <a href='' class='reloadcard' id='reloadcard_1'>Flip through cards</a> until you get a card that feels like a viable first option.",
      '2a': "<strong>Option 2:</strong>",
      '2b': "<strong>Option 2:</strong> <a href='' class='reloadcard' id='reloadcard_2'>Flip through cards</a> until you get a card that feels like a viable second option.",
      '3a': "<strong>Option 3:</strong>",
      '3b': "<strong>Option 3:</strong> <a href='' class='reloadcard' id='reloadcard_3'>Flip through cards</a> until you get a card that feels like a viable third option.",
    }      
    }
  } else {
    params['spread'] = 'hru'
  }
  
  res.render('index', params);
});

module.exports = router;
