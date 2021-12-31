/* eslint-disable jest/require-hook */
/* eslint-disable @typescript-eslint/naming-convention */
import SpotifyWebApi from "spotify-web-api-node";

const spotifyWebApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let mostRecentExpiryTimestamp = Date.now();

export const getSpotifyClient = () =>
  spotifyWebApi.getAccessToken() && Date.now() < mostRecentExpiryTimestamp
    ? Promise.resolve(spotifyWebApi)
    : spotifyWebApi
        .clientCredentialsGrant()
        .then(({ body: { access_token, expires_in } }) => {
          mostRecentExpiryTimestamp = Date.now() + expires_in * 1000;
          spotifyWebApi.setAccessToken(access_token);
          return spotifyWebApi;
        });
