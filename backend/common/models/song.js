'use strict';

const conf = require('../../cloudantAPI/cloudantAPI_conf');
const cloudantAPI_songs = require('../../cloudantAPI/cloudantAPI_songs');

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const request = require('request');

const personalityInsights = new PersonalityInsightsV3({
  url: "https://gateway.watsonplatform.net/personality-insights/api",
  username: "f3828a21-d85e-4227-a941-991b03f804f1",
  password: "WkDLK0iHT8QS",
  version_date: '2017-09-21'
});

const toneAnalyzer = new ToneAnalyzerV3({
  url: "https://gateway.watsonplatform.net/tone-analyzer/api",
  username: "afb675a0-d47e-4e16-91cc-1962be68bbb2",
  password: "V3otdAze6qBU",
  version_date: '2017-09-21'
});

const dbOptions = {
  method: 'GET',
  url: conf.endpoint + 'api/Songs',
  headers:
    {
      accept: 'application/json',
      'x-ibm-client-secret': conf.clientSecret,
      'x-ibm-client-id': conf.clientId
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
  const songsAPI = new cloudantAPI_songs();

  Song.recommend = function (req, text, callback) {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      let error = new Error();
      error.status = 403;
      return callback(error);
    }

    analyzeText(text, (error, songs, tones, personalities) => {
      if (error) return callback(error);

      songsAPI.linkClient(songs[0].id, accessToken, (error, feedBody) => {
        if (error) return callback(error);
        else callback(null, songs, tones, personalities, feedBody);
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
    returns: [
      {
        arg: 'songs',
        type: 'array',
      },
      {
        arg: 'tone',
        type: 'object',
      },
      {
        arg: 'personality',
        type: 'object',
      },
      {
        arg: 'feedBody',
        type: 'object'
      }
    ],
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

    callback(null, songs, tones, personalities);
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
