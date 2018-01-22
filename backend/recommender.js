var request = require("request");

var options = { method: 'GET',
  url: 'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs',
  // qs: { filter: 'REPLACE_THIS_VALUE' },
  headers:
   { accept: 'application/json',
     'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
     'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43' } };

var testPersonality = {
  big5_openness: 0.3227923286552164,
     big5_conscientiousness: 0.6721415381590677,
     big5_extraversion: 0.3727363658986805,
     big5_agreeableness: 0.667430022252213,
     big5_neuroticism: 0.41473325961595264
};

var testTones = {
  analytical: 0.7249116666666667,
     fear: 0.920116,
     joy: 0.7929360000000001,
     confident: 0.704642
};


request(options, function (error, response, body) {
  let songs = JSON.parse(body);
  let tones = testTones;
  let personalities = testPersonality;
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

    // console.log('Success: ', query
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

  console.log(score);
});
/*
request(options, function (error, response, body, testTone, testPersonality) {
  if (error) return console.error('Failed: %s', error.message);
  var query = JSON.parse(body)

  // console.log('Success: ', query);
  // Personality Distance
  var personalityDistance = [];
  for(var i = 0; i < query.length; i++){
    var sum = 0;
    Object.keys(query[i].personalities).forEach((key) => {
      sum += Math.pow(2, testPersonality[key] - query[i].personalities[key]);
    });
    personalityDistance.push([query[i].id, Math.sqrt(sum)]);
  }

  //Tone Distance

var toneDistance = [];
  for(var i = 0; i < query.length; i++){
    let a = new Set(Object.keys(query[i].tones));
    let b = new Set(Object.keys(testTones));
    let union = new Set([...a, ...b]);
    var sum = 0;

    // console.log('Success: ', query
    union.forEach((key) => {
    if (!testTones[key]) {
      testTones[key] = 0;
    }

    if (!query[i].tones[key]) {
      query[i].tones[key] = 0;
    }
      sum += Math.pow(2, testTones[key] - query[i].tones[key]);
    });
    toneDistance.push([query[i].id, Math.sqrt(sum)]);
  }

toneDistance.sort((a, b) => a[1] - b[1])
personalityDistance.sort((a, b) => a[1] - b[1])
});
*/
