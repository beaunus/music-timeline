import type { NextApiRequest, NextApiResponse } from "next";

import { Release } from "../../../..";
import { getReleaseGroups } from "../../../../utils/musicbrainz";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Release[]>
) {
  const { artistId } = req.query as { artistId: string };

  return getReleaseGroups({ artistId }).then((releaseGroups) =>
    res.json(
      releaseGroups.map((releaseGroup) => ({
        artistId,
        id: releaseGroup.id,
        releaseDate: new Date(releaseGroup["first-release-date"]),
        title: releaseGroup.title,
      }))
    )
  );
}
