## Home Cinema

A website for browsing movie lists and information. it uses [YTS](https://yts.mx/) API and [Torrent Streamer Api](https://github.com/KHLALA-Gh/torrent-streamer-api), built with [Vite](https://vite.dev/) and [React](https://react.dev/)

![](./imgs/home_page.png)

### Setup

#### Docker (Recommended) :

You can use Home Cinema Docker images to run the application with Docker Compose.
First create `docker-compose.yml` file in the location you want and add the content below.

```yml
services:
  home-cinema-website:
    image: khlala/home-cinema-web:alpha3
    # image: khlala/home-cinema-web:alpha3-arm64  ## use this image if you are running on arm64 arch
    ports:
      - "8000:4173"
    environment:
      - TMDB_KEY=<your_TMDB_api_key> ## Set your TMDB api key here
    restart: always
```

To get TV Shows information you need to get TMDB api key from [TMDB](https://www.themoviedb.org/).

> **Note** : Home cinema is still in alpha versions, you may encounter difficulties when installing it.

To run the application execute this command :

```shell
docker compose up
```

The website should be accessible from : http://localhost:8000/home_cinema

### Configs

Create `./config` directory where you created `docker-compose.yml`. Then create your config file `home_cinema_config.json` inside the new directory.
If you want to know about configurations go [here](./docs/configurations.md).

To pass configs through docker compose add your config file in the container volumes.

```yml
volumes:
  - ./config/home_cinema_config.json:/app/dist/home_cinema_config.json
```

### Issues

If you encounter any issues using the website don't hesitate to submit an [issue](https://github.com/KHLALA-Gh/HomeCinemaWebsite/issues)
