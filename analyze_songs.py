import requests

API_KEY = "f727868c408e5996298e495da0b1f1f6"


def get_lyrics(id):
    response = requests.get(
        "http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=f727868c408e5996298e495da0b1f1f6&track_id=" + id)

    lyrics = response.json()['message']['body']['lyrics']['lyrics_body']

    lyrics = lyrics[:lyrics.find('\n...\n\n*******')]

    return lyrics


def analyze_tones(lyrics):
    response = requests.post('https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21',
                             json={'text': lyrics}, auth=('6b9d8b2a-b0e0-4ea6-8545-94dbc29ceb1b', 'UpcRHdvKpfC4'))

    result_json = response.json()

    tones = {}

    if 'sentences_tone' not in result_json and "document_tone" in result_json:
        for tone in result_json['document_tone']['tones']:
            tones[tone['tone_id']] = tone['score']
        return tones
    else:
    	print("No tone")
    	print(result_json)

    sentences = filter(lambda x: len(x['tones']) > 0, result_json['sentences_tone'])

    for sentence in sentences:
        for tone in sentence['tones']:
            if tone['tone_id'] not in tones:
                tones[tone['tone_id']] = {
                    'avg': tone['score'],
                    'count': 1
                }
            else:
                tones[tone['tone_id']]['avg'] = (tones[tone['tone_id']]['avg'] * tones[tone['tone_id']]['count'] +
                                                 tone['score']) / (tones[tone['tone_id']]['count'] + 1)
                tones[tone['tone_id']]['count'] += 1

    for key, value in tones.items():
        tones[key] = value['avg']

    return tones


def analyze_personality(lyrics):
    body = lyrics

    while len(body.split()) < 150:
        body += lyrics

    response = requests.post(
        'https://gateway.watsonplatform.net/personality-insights/api/v3/profile?version=2017-09-21',
        data=body.encode('utf-8'), auth=('a305ea75-d537-4a7b-80ed-ec43966043f4', 'cnnQB2MSqQGe'),
        headers={'Content-Type': 'text/plain; charset=UTF-8'})

    personalities = {}

    for personality in response.json()['personality']:
        personalities[personality['trait_id']] = personality['percentile']

    return personalities


def save_song(song):
    requests.post('https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs',
                  headers={
                      'accept': 'application/json',
                      'content-type': 'application/json',
                      'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
                      'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
                  }, json=song)


with open("backend/songs.csv", "r", encoding='utf-8') as f:
    for line in f:
        print("Processing " + line)

        row = line[:-1].split('|')

        lyrics = get_lyrics(row[0])

        tones = analyze_tones(lyrics)

        personalities = analyze_personality(lyrics)

        song = {
            'title': row[1],
            'artist': row[2],
            'personalities': personalities,
            'tones': tones
        }

        #save_song(song)
