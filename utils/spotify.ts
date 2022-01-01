/* eslint-disable jest/require-hook */
/* eslint-disable @typescript-eslint/naming-convention */
import { differenceInYears } from "date-fns";
import SpotifyWebApi from "spotify-web-api-node";

import { MAX_DURATION_OF_CAREER_IN_YEARS } from "./constants";

const spotifyWebApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let mostRecentExpiryTimestamp = Date.now();

export function getArtistAlbumsAll(
  artistId: string,
  offset = 0
): Promise<SpotifyApi.AlbumObjectSimplified[]> {
  return getSpotifyClient().then((spotifyClient) =>
    spotifyClient
      .getArtistAlbums(artistId, {
        include_groups: "album",
        limit: 50,
        offset,
      })
      .then((data) =>
        data.body.next
          ? getArtistAlbumsAll(artistId, offset + 50).then((newItems) =>
              newItems.concat(data.body.items)
            )
          : data.body.items
      )
  );
}

export function getSpotifyClient() {
  return spotifyWebApi.getAccessToken() &&
    Date.now() < mostRecentExpiryTimestamp
    ? Promise.resolve(spotifyWebApi)
    : spotifyWebApi
        .clientCredentialsGrant()
        .then(({ body: { access_token, expires_in } }) => {
          mostRecentExpiryTimestamp = Date.now() + expires_in * 1000;
          spotifyWebApi.setAccessToken(access_token);
          return spotifyWebApi;
        });
}

export function isRelevantRelease(
  release: { artistId: string; releaseDate: Date; title: string },
  _index: number,
  [earliestRelease]: { artistId: string; releaseDate: Date; title: string }[]
) {
  return (
    differenceInYears(release.releaseDate, earliestRelease.releaseDate) <
    MAX_DURATION_OF_CAREER_IN_YEARS
  );
}
