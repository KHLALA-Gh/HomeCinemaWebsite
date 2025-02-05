# Configurations

### torrent-streamer-api

**properties :**

- origin (string) : Torrent Streamer Api origin (for example http://localhost:8080)
- external (boolean) : If set to false torrent streamer api handlers will be mounted to the website server. If set to true it will use an external torrent streamer api from the `origin` property.

**example :**

```json
{
  "torrent-streamer-api": {
    "origin": "http://localhost:8080",
    "external": true
  }
}
```
