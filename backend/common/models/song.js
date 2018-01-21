'use strict';

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

const personalityInsights = new PersonalityInsightsV3({
  url: "https://gateway.watsonplatform.net/personality-insights/api",
  username: "a305ea75-d537-4a7b-80ed-ec43966043f4",
  password: "cnnQB2MSqQGe",
  version_date: '2017-09-21'
});

const toneAnalyzer = new ToneAnalyzerV3({
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  username: "6b9d8b2a-b0e0-4ea6-8545-94dbc29ceb1b",
  password: "UpcRHdvKpfC4",
  version_date: '2017-09-21'
});

const watsonResolver = function (resolve, reject) {
  return function (error, result) {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  };
};

module.exports = function (Song) {
  Song.recommend = function (text, callback) {
    console.log(text);
    analyzeText(text, callback);
  };

  Song.remoteMethod('recommend', {
    accepts: {arg: 'text', type: 'string'},
    returns: {arg: 'song', type: 'Song'}
  });
};

const analyzeText = function (text, callback) {

  const tonePromise = new Promise((resolve, reject) => toneAnalyzer.tone({text: text},
    watsonResolver(resolve, reject)));

  const personalityPromise = new Promise((resolve, reject) => personalityInsights.profile({text: text},
    watsonResolver(resolve, reject)));

  Promise.all([tonePromise, personalityPromise]).then(function (values) {
    console.log(values);

    const tones = getTones(values[0]);
    const personalities = getPersonalities(values[1]);

    // TODO GET SONG HERE

    callback({title: 'lmao', artist: 'lmao'});
  }, function (error) {
    console.error(error);
    callback({title: 'nooooo', artist: 'nooooo'});
  })
};

const getTones = function (response) {
  let tones = {};

  if (!('sentences_tone' in response)) {
    response.document_tone.forEach(tone => tones[tone.tone_id] = tone.score);
    return tones;
  }

  const sentences = response.sentences_tone.filter(sentence => sentence.tones.length > 0);

  sentences.forEach(sentence => {
    sentence.tones.forEach(tone => {
      if (!(tone.tone_id in tones)) {
        tones[tone.tone_id] = {avg: tone.score, count: 1}
      } else {
        tones[tone.tone_id].avg = (tones[tone.tone_id].avg * tones[tone.tone_id].score + tone.score) / (tones[tone.tone_id].score + 1);
        tones[tone.tone_id].score += 1;
      }
    });
  });

  Object.keys(tones).forEach(key => {
    tones[key] = tones[key].avg;
  });

  return tones;
};

const getPersonalities = function (response) {
  let personalities = {};
  response.personality.forEach(personality => personalities[personality.trait_id] = personality.percentile);
  return personalities
};
