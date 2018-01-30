import requests
import pandas as pd
song = {


}

response = requests.get('https://api.us.apiconnect.ibmcloud.com/tltranstudentvunl-dev/sb/api/Songs?filter={"where":{"title":"Say Something", "artist":"Justin Timberlake feat. Chris Stapleton"}}',
            headers={
                'accept': 'application/json',
                'content-type': 'application/json',
                'x-ibm-client-secret': 'rD5lP8gW5qL4jB7fK7aS7dF0rP6nK4xD5fI2sO6bB4jW8eJ1tH',
                'x-ibm-client-id': 'eb4ea9ba-bd16-4789-bfd5-56620abc3d43'})

# songs = pd.read_json(response.json())
print(response.json())
