import requests


response = requests.get("https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs", headers={
    'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
    'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
})

songs = response.json()

print(songs[1]['title'])

new_songs = []
processed_songs = []
#
# for song in songs:
#     if (song['title'], song['artist']) not in processed_songs:
#         new_songs.append(song)
#         processed_songs.append((song['title'], song['artist']))
#     else:
#         print("Deleting " + song['title'] + " - " + song['artist'])
#         delete_result = requests.delete("https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs/" + song['id'], headers={
#             'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
#             'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'
#         })
#
#         print("result: " + str(delete_result.status_code))

print(len(new_songs))
