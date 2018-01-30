import json
from bs4 import BeautifulSoup as bs
import requests

def getCoverArt(i, j):
    link = "http://api.musixmatch.com/ws/1.1/chart.tracks.get?apikey=f727868c408e5996298e495da0b1f1f6&?page=" + str(i) + "&page_size=100&f_has_lyrics=1?"
    response = requests.get(link)
    artist_name = response.json()['message']['body']['track_list'][j]['track']['artist_name']
    song_name = response.json()['message']['body']['track_list'][j]['track']['track_name']

    url = response.json()['message']['body']['track_list'][j]['track']['track_share_url']
    headers = {"user-agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36"}#,
    html_content = requests.get(url,  headers = headers)
    soup = bs(html_content.content)
    picture_url = "https:/" + soup.find("div", {"class": "banner-album-image-desktop"}).find("img")['src']

    coverart = {
    "song" : song_name,
    "artist" : artist_name,
    "coverart" : picture_url
    }
    return coverart

def getDatabaseSongs(artist, title):
    response = requests.get('https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs?filter={"where":{"title":"'+ str(title) + '", "artist":"' + str(artist) + '"}}',
                headers={
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
                    'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'})
    return response.json()


def save_song_olddb(song):
    requests.post('https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/coverart',
                  headers={
                      'accept': 'application/json',
                      'content-type': 'application/json',
                      'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
                      'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
                  }, json=song)

# curl -X POST "https://$ACCOUNT.cloudant.com/$DATABASE/_changes?filter=_selector" -d @request.json

def save_song_newdb(song):
    requests.post('https://api.us.apiconnect.ibmcloud.com/VU_v2/api/Songs',
                  headers={
                      'accept': 'application/json',
                      'content-type': 'application/json',
                      'x-ibm-client-secret': '27d345dd99f148caae37b7631e0b5fcae68df2a39e6d4001a232d5f0bdbc86e8',
                      'x-ibm-client-id': '677b1966-8dd0-479a-85ef-8eee522cc882'
                  }, json=song)

for i in range(1,3):
    link = "http://api.musixmatch.com/ws/1.1/chart.tracks.get?apikey=f727868c408e5996298e495da0b1f1f6&?page=" + str(i) + "&page_size=100&f_has_lyrics=1?"
    response = requests.get(link)
    for j in range(len(response.json()['message']['body']['track_list'])):
        coverart = getCoverArt(i, j)
        wholething = {
            "song_deets": getDatabaseSongs(coverart['song'], coverart['artist']),
            "coverart" : coverart['coverart']}
        save_song_newdb(wholething)
        print(wholething)
