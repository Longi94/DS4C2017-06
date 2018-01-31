from bs4 import BeautifulSoup as bs
import requests


def getCoverArt(url):
    headers = {
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36"}  # ,
    html_content = requests.get(url, headers=headers)
    soup = bs(html_content.content, "lxml")
    try:
        picture_url = "https:" + soup.find("div", {"class": "banner-album-image-desktop"}).find("img")['src']
        return picture_url
    except Exception:
        return None


def getDatabaseSongs(artist, title):
    response = requests.get(
        'https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs?filter={"where":{"title":"' + str(
            title) + '", "artist":"' + str(artist) + '"}}',
        headers={
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
            'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'})
    return response.json()


def save_song(song):
    print("saving " + song['id'])
    result = requests.put('https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs',
                 headers={
                     'accept': 'application/json',
                     'content-type': 'application/json',
                     'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
                     'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
                 }, json=song)
    print("result" + str(result.status_code))


response = requests.get("https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs", headers={
    'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
    'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
})

songs = response.json()

songs = list(filter(lambda song: 'cover' not in song, songs))

for i in range(3):
    link = "http://api.musixmatch.com/ws/1.1/chart.tracks.get?apikey=f727868c408e5996298e495da0b1f1f6&?page=" + str(
        i) + "&page_size=100&f_has_lyrics=1"
    response = requests.get(link)

    track_list = response.json()['message']['body']['track_list']

    for track in track_list:
        for j in range(len(songs)):
            print(str(i) + '-' + str(j))

            if track['track']['track_name'] == songs[j]['title'] and track['track']['artist_name'] == songs[j]['artist']:
                cover_art = getCoverArt(track['track']['track_share_url'])

                songs[j]['cover'] = cover_art
                save_song(songs[j])
                del songs[j]
                break
