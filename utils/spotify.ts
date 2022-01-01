/* eslint-disable jest/require-hook */
/* eslint-disable @typescript-eslint/naming-convention */
import { differenceInYears } from "date-fns";
import SpotifyWebApi from "spotify-web-api-node";

import { ARTIST_NAMES, MAX_DURATION_OF_CAREER_IN_YEARS } from "./constants";

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

export function getArtistId(artistName: string) {
  return getSpotifyClient().then((spotifyClient) =>
    spotifyClient
      .searchArtists(artistName)
      .then((result) => result.body.artists?.items[0].id)
  );
}
export const getArtistNameByArtistId = () =>
  Promise.all(
    ARTIST_NAMES.map((artistName) =>
      getArtistId(artistName).then((artistId) => [artistId, artistName])
    )
  ).then((entries) => Object.fromEntries(entries));

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
