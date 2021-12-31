/* eslint-disable @typescript-eslint/naming-convention */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Release } from "../../data/data";
import { getSpotifyClient } from "../../utils/spotify";

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
        data.body.items.map((item) => ({
          artistId: "The Beatles",
          releaseDate: new Date(item.release_date),
          title: item.name,
        }))
      )
    )
    .catch(console.error);
}
