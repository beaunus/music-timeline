import axios from "axios";

interface ReleaseGroup {
  disambiguation: string;
  "first-release-date": string;
  id: string;
  "primary-type": string;
  "primary-type-id": string;
  "secondary-type-ids": string[];
  "secondary-types": string[];
  title: string;
}

export const getReleaseGroups = ({ artistId }: { artistId: string }) =>
  axios
    .get<{
      "release-group-count": number;
      "release-group-offset": number;
      "release-groups": ReleaseGroup[];
    }>(
      `https://musicbrainz.org//ws/2/release-group?artist=${artistId}&type=album|ep&fmt=json`
    )
    .then(({ data }) => data["release-groups"]);
