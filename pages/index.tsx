import { differenceInYears, getYear } from "date-fns";
import _ from "lodash";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";

import { Artist, getArtists, getReleases, Release } from "../data/data";

type Mode = "byArtist" | "byMember";

const NUM_MS_IN_ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

const Home: NextPage = () => {
  const [artists, setArtists] = React.useState<Artist[]>();
  const [releases, setReleases] = React.useState<Release[]>();
  const [mode, setMode] = React.useState<Mode>("byMember");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    Promise.all([getReleases(), getArtists()]).then(([releases, artists]) => {
      setReleases(releases);
      setArtists(artists);
    });
  }, []);

  const releasesByArtist = _.groupBy(releases, "artistId");
  const artistIdsByPersonId = Object.fromEntries(
    artists?.flatMap((artist) =>
      artist.members.map((member) => [
        member.id,
        artists
          .filter(({ members }) => members.some(({ id }) => id === member.id))
          .map(({ id }) => id),
      ])
    ) ?? []
  );

  const personById = _.keyBy(
    _.uniq(artists?.flatMap((artist) => artist.members)),
    "id"
  );

  const releasesByPersonId = Object.fromEntries(
    Object.entries(artistIdsByPersonId).map(([personId, artistIds]) => [
      personId,
      releases?.filter(({ artistId }) => artistIds.includes(artistId)),
    ])
  );

  const years = _.sortBy(
    _.uniq(releases?.map(({ releaseDate }) => getYear(releaseDate)))
  );

  const yearsToRender = _.range(
    _.first(years) ?? 0,
    (_.last(years) ?? 0) + 2
  ).map(String);

  const ages = _.sortBy(
    _.uniq(
      Object.entries(releasesByPersonId).flatMap(
        ([personId, personReleases]) =>
          personReleases?.map(({ releaseDate }) =>
            differenceInYears(releaseDate, personById[personId].dateOfBirth)
          ) ?? 0
      )
    )
  );

  const agesToRender = _.range(_.first(ages) ?? 0, (_.last(ages) ?? 0) + 2).map(
    String
  );

  const TIMESTAMP_START =
    mode === "byArtist"
      ? new Date(yearsToRender?.[0] || Date.now()).valueOf()
      : Number(agesToRender[0]) * NUM_MS_IN_ONE_YEAR;
  const TIMESTAMP_END =
    mode === "byArtist"
      ? new Date(
          yearsToRender?.[yearsToRender?.length - 1] || Date.now()
        ).valueOf()
      : Number(agesToRender[agesToRender.length - 1]) * NUM_MS_IN_ONE_YEAR;

  const modes: Mode[] = ["byArtist", "byMember"];

  const ReleaseTooltip: React.FC<{ release: Release }> = ({ release }) => (
    <ReactTooltip
      effect="float"
      id={`${release.artistId}_${release.title}`}
      place="top"
      type="dark"
    >
      <div>{release.artistId}</div>
      <div>{release.releaseDate.toLocaleDateString()}</div>
      <div>{release.title}</div>
    </ReactTooltip>
  );

  return (
    <>
      <div className="flex gap-6">
        {modes.map((modeString) => (
          <div className="flex gap-2 items-center" key={_.uniqueId("mode")}>
            <input
              defaultChecked={mode === modeString}
              id={modeString}
              name="mode"
              onClick={() => setMode(modeString)}
              type="radio"
              value={modeString}
            />
            <label htmlFor={modeString}>{modeString}</label>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[max-content_auto] space-x-1 w-full">
        {mode === "byArtist" ? (
          <>
            <div />
            <div className="flex gap-1 justify-between">
              {yearsToRender.map((year) => (
                <div key={_.uniqueId("year")}>{year}</div>
              ))}
            </div>
            {Object.entries(releasesByArtist).flatMap(
              ([artistId, artistReleases]) => [
                <div className="text-right" key={_.uniqueId("artistId")}>
                  {artistId}
                </div>,
                <div className="w-full" key={_.uniqueId("artistRelease")}>
                  <div className="flex items-center">
                    <div className="w-full h-0 border-b-2"></div>
                  </div>
                  <div className="relative">
                    {artistReleases.map((release) => (
                      <div key={_.uniqueId("release")}>
                        <div
                          className="absolute w-2 h-2 border-2"
                          data-for={`${release.artistId}_${release.title}`}
                          data-tip
                          style={{
                            left: `${
                              (100 *
                                (release.releaseDate.valueOf() -
                                  TIMESTAMP_START)) /
                              (TIMESTAMP_END - TIMESTAMP_START)
                            }%`,
                          }}
                        />
                        <ReleaseTooltip release={release} />
                      </div>
                    ))}
                  </div>
                </div>,
              ]
            )}
          </>
        ) : (
          <>
            <div />
            <div className="flex gap-1 justify-between">
              {agesToRender.map((year) => (
                <div key={_.uniqueId("year")}>{year}</div>
              ))}
            </div>
            {Object.entries(releasesByPersonId).flatMap(
              ([personId, personReleases]) => [
                <div className="text-right" key={_.uniqueId("artistId")}>
                  {personId}
                </div>,
                <div className="w-full" key={_.uniqueId("artistRelease")}>
                  <div className="flex items-center">
                    <div className="w-full h-0 border-b-2"></div>
                  </div>
                  <div className="relative">
                    {personReleases?.map((release) => (
                      <div key={_.uniqueId("release")}>
                        <div
                          className="absolute w-2 h-2 border-2"
                          data-for={`${release.artistId}_${release.title}`}
                          data-tip
                          style={{
                            left: `${
                              (100 *
                                (release.releaseDate.valueOf() -
                                  personById[personId].dateOfBirth.valueOf() -
                                  TIMESTAMP_START)) /
                              (TIMESTAMP_END - TIMESTAMP_START)
                            }%`,
                          }}
                        />
                        <ReleaseTooltip release={release} />
                      </div>
                    ))}
                  </div>
                </div>,
              ]
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
