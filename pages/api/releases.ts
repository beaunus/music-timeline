/* eslint-disable @typescript-eslint/naming-convention */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

import { Release } from "../../data/data";
import { getArtistNameByArtistId } from "../../utils/constants";
import { getArtistAlbumsAll, isRelevantRelease } from "../../utils/spotify";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Release[]>
) {
  return getArtistNameByArtistId().then((artistNameByArtistId) =>
    Promise.all(
      Object.keys(artistNameByArtistId).map((artistId) =>
        getArtistAlbumsAll(artistId).then((albums) =>
          _.sortBy(
            albums.map((album) => ({
              artistId,
              releaseDate: new Date(album.release_date),
              title: album.name,
            })),
            "releaseDate"
          ).filter(isRelevantRelease)
        )
      )
    ).then((artistAlbums) => res.json(artistAlbums.flat()))
  );
}
