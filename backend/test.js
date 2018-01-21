//connections and imports
var util  = require("util");
var mXm   = require("musixmatch");
mXm.Config.API_KEY = "47ed2530c03a3e45d291e3c67c04b80a";
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var watson = require('watson-developer-cloud');
var fs = require('fs');
var request = require("request");

//success message
var successCallback = function(modelOrCollection, row) {
  // console.log("Success:");
  // console.log(util.inspect(modelOrCollection));
  // console.log("  " + modelOrCollection.attributes.lyrics_body);

  var lyrics = modelOrCollection.attributes.lyrics_body + modelOrCollection.attributes.lyrics_body + modelOrCollection.attributes.lyrics_body;
  var defaultParameters = {
    'textToAnalyze': lyrics,
        "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
          "username": "6b9d8b2a-b0e0-4ea6-8545-94dbc29ceb1b",
          "password": "UpcRHdvKpfC4",
          "sentences": "false"
  }
  // console.log(row);
    var song = {
      title: row[1],
      artist: row[2],
      lyrics: lyrics
    };

  // console.log(song);
  if (require.main === module) {
    tone(defaultParameters)
      .then((results) => handleToneResult(song, results))
      .catch((error) => console.log(error.message));
  }
};
console.log("here!");
var handleToneResult = function (song, result) {
  result.sentences_tone = result.sentences_tone.filter(function (sentence) {
    return sentence.tones.length > 0;
  })
  song.tones = result;
console.log("here!");
  var defaultParameters2 = {
    'textToAnalyze': song.lyrics,
        "url": "https://gateway.watsonplatform.net/personality-insights/api",
      "username": "a305ea75-d537-4a7b-80ed-ec43966043f4",
      "password": "cnnQB2MSqQGe",
      "sentences": "false"
  }


  if (require.main === module)
    personality(defaultParameters2)
        .then((results) => handlePersonalityResult(song, results))
        .catch((error) => console.log(error.message));

};

//final method that dumps
var handlePersonalityResult = function (song, result) {
  song.personalities = result;
  // console.log(JSON.stringify(song, null, 2));
  var tones = {}
  song.tones.sentences_tone.forEach((sentence) => {
    sentence.tones.forEach((tone) => {
      if(!(tone.tone_id in tones)){
        tones[tone.tone_id] = {
          avg: tone.score,
          count: 1
        };
      } else {
        tones[tone.tone_id].avg = (tones[tone.tone_id].avg * tones[tone.tone_id].count +
           tone.score) / (tones[tone.tone_id].count + 1)
        tones[tone.tone_id].count += 1;
      }

    })
  })

  Object.keys(tones).forEach((key) => {
    tones[key] = tones[key].avg;
  });

  var personalities = {};

  song.personalities.personality.forEach((personality) => {
    personalities[personality.trait_id] = personality.percentile;
  })
  song.personalities = personalities;
  song.tones =  tones;

  this.options = {
    method: 'POST',
    url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
        'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43' },
    body: song,
    json: true
};

request(options, function (error, response, body) {
  if (error) return console.error('Failed: %s', error.message);

  // console.log('Success: ', body);

});


}

//failure message
var errorCallback = function(response) {
  console.log("Error callback:");
  console.log("  " + util.inspect(response));
};

//actual request for lyrics

var file = fs.readFileSync('songs.csv', 'utf8').split('\n');
// console.log(file);

for (var i = 1; i < 2; i++) {
  // console.log(i);
  var row = file[i].split('|');
  // console.log(row[0
  mXm.API.getLyrics(row[0], (modelOrCollection) => successCallback(modelOrCollection, row), errorCallback);
}

function tone(params) {
  return new Promise(function (resolve, reject) {
    var res = {};

    const ToneAnalyzerV3 =
      require('watson-developer-cloud/tone-analyzer/v3');

    var url = params.url || 'https://gateway.watsonplatform.net/tone-analyzer/api' ;
    var use_unauthenticated =  params.use_unauthenticated || false ;

    const tone_analyzer = new ToneAnalyzerV3({
      'username': params.username,
      'password': params.password,
      'version_date': '2017-09-21',
      'url' : url,
      'use_unauthenticated': use_unauthenticated
    });

    tone_analyzer.tone({'text': params.textToAnalyze}, function(err, res) {
      if (err)
        reject(err);
      else
        resolve(res);
    });
  });
}

function personality(params) {
  return new Promise(function (resolve, reject) {
    var res = {};

    const PersonalityInsightsV3 =
      require('watson-developer-cloud/personality-insights/v3');

    var url = params.url || 'https://gateway.watsonplatform.net/personality-insights/api' ;
    var use_unauthenticated =  params.use_unauthenticated || false ;

    const personality_insights = new PersonalityInsightsV3({
      'username': params.username,
      'password': params.password,
      'version_date': '2017-09-21',
      'url' : url,
      'use_unauthenticated': use_unauthenticated
    });

    personality_insights.profile({'text': params.textToAnalyze},
                                 function(err, res) {
      if (err)
        reject(err);
      else
        resolve(res);
    });
  });
}
