/* eslint-disable @typescript-eslint/naming-convention */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { differenceInYears } from "date-fns";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

import { Release } from "../../data/data";
import { getSpotifyClient } from "../../utils/spotify";

const MAX_DURATION_OF_CAREER_IN_YEARS = 30;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Release[]>
) {
  const spotifyClient = await getSpotifyClient();

  return spotifyClient
    .getArtistAlbums("3WrFJ7ztbogyGnTHbHJFl2", {
      include_groups: "album",
      limit: 50,
    })
    .then((data) =>
      res.json(
        _.sortBy(
          data.body.items.map((item) => ({
            artistId: "The Beatles",
            releaseDate: new Date(item.release_date),
            title: item.name,
          })),
          "releaseDate"
        ).filter(
          (release, _index, [earliestRelease]) =>
            differenceInYears(
              release.releaseDate,
              earliestRelease.releaseDate
            ) < MAX_DURATION_OF_CAREER_IN_YEARS
        )
      )
    )
    .catch(console.error);
}
