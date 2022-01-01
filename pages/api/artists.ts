// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Release } from "../../data/data";
import { getArtistNameByArtistId } from "../../utils/spotify";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Release[]>
) {
  return getArtistNameByArtistId().then((artistNameByArtistId) =>
    res.json(artistNameByArtistId)
  );
}
