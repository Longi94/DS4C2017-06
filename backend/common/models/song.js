'use strict';
const cloudantAPI_feeds = require('../../cloudantAPI/cloudantAPI_feeds.js');

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const request = require('request');
const loopback = require('loopback');

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

const dbOptions = {
  method: 'GET',
  url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs',
  headers:
    {
      accept: 'application/json',
      'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
      'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
    }
};

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
  const feedsAPI = new cloudantAPI_feeds();

  Song.recommend = function (req, text, callback) {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      let error = new Error();
      error.status = 403;
      return callback(error);
    }

    analyzeText(text, (error, songs) => {
      if (error) return callback(error);

      feedsAPI.postFeed(userId, songs[0].id, (error, body) => {
        if (error) return callback(error);
        else callback(null, songs);
      });

    });
  };

  Song.remoteMethod('recommend', {
    accepts: [
      {
        arg: 'req',
        type: 'object',
        required: true,
        description: '',
        http: {
          source: 'req'
        }
      },
      {
        arg: 'text',
        type: 'string'
      }],
    returns: {type: 'array', root: true},
    description: 'Remote method to launch recommendation engine'
  });
};

const analyzeText = function (text, callback) {

  const tonePromise = new Promise((resolve, reject) => toneAnalyzer.tone({text: text},
    watsonResolver(resolve, reject)));

  const personalityPromise = new Promise((resolve, reject) => personalityInsights.profile({text: text},
    watsonResolver(resolve, reject)));

  const songsPromise = new Promise((resolve, reject) => {
    request(dbOptions, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    })
  });

  Promise.all([tonePromise, personalityPromise, songsPromise]).then(values => {
    console.log(values);

    const tones = getTones(values[0]);
    const personalities = getPersonalities(values[1]);

    const songs = getTop10Songs(tones, personalities, JSON.parse(values[2]));

    callback(null, songs);
  }, error => callback(error));
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

const getTop10Songs = function (tones, personalities, songs) {

  let score = [];

  for (let i = 0; i < songs.length; i++) {
    // Personality Distance
    let sum = 0;
    Object.keys(songs[i].personalities).forEach((key) => {
      sum += Math.pow(2, personalities[key] - songs[i].personalities[key]);
    });

    let personalityDistance = Math.sqrt(sum);

    //Tone Distance
    let a = new Set(Object.keys(songs[i].tones));
    let b = new Set(Object.keys(tones));
    let union = new Set([...a, ...b]);
    sum = 0;

    union.forEach((key) => {
      if (!tones[key]) {
        tones[key] = 0;
      }

      if (!songs[i].tones[key]) {
        songs[i].tones[key] = 0;
      }
      sum += Math.pow(2, tones[key] - songs[i].tones[key]);
    });

    let toneDistance = Math.sqrt(sum);

    score.push({
      song: songs[i],
      score: personalityDistance + toneDistance
    });
  }

  score.sort((a, b) => a.score - b.score);

  return score.splice(0, 10).map(score => score.song);
};
