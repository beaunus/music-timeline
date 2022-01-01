import axios from "axios";
import {
  differenceInMilliseconds,
  differenceInYears,
  format,
  getYear,
} from "date-fns";
import _ from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";

import { Artist, getArtists, Release } from "../data/data";
import { getArtistNameByArtistId } from "../utils/constants";

type Mode = "byArtist" | "byMember";

const NUM_MS_IN_ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

const Home: NextPage = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [releases, setReleases] = React.useState<Release[]>([]);
  const [artistNameByArtistId, setArtistNameByArtistId] = React.useState<
    Record<string, string>
  >({});
  const [mode, setMode] = React.useState<Mode>("byArtist");

  useEffect(() => {
    Promise.all([
      getArtistNameByArtistId().then(setArtistNameByArtistId),
      axios.get<Release[]>("/api/releases").then(({ data }) => {
        setReleases(
          data.map((release) => ({
            ...release,
            releaseDate: new Date(release.releaseDate),
          }))
        );
      }),
      getArtists().then(setArtists),
    ]);
  }, []);

  const releasesByArtist = _.groupBy(releases, "artistId");
  const artistIdsByPersonId = Object.fromEntries(
    artists.flatMap((artist) =>
      artist.members.map((member) => [
        member.id,
        artists
          .filter(({ members }) => members.some(({ id }) => id === member.id))
          .map(({ id }) => id),
      ])
    ) ?? []
  );

  const personById = _.keyBy(
    _.uniq(artists.flatMap((artist) => artist.members)),
    "id"
  );

  const releasesByPersonId = Object.fromEntries(
    Object.entries(artistIdsByPersonId).map(([personId, artistIds]) => [
      personId,
      releases.filter(({ artistId }) => artistIds.includes(artistId)),
    ])
  );

  const years = _.uniq(releases.map(({ releaseDate }) => getYear(releaseDate)));

  const yearsToRender = _.range(
    _.minBy(years) ?? 0,
    (_.maxBy(years) ?? 0) + 2
  ).map(String);

  const agesSorted = _.uniq(
    Object.entries(releasesByPersonId).flatMap(([personId, personReleases]) =>
      personReleases.map(({ releaseDate }) =>
        differenceInYears(releaseDate, personById[personId].dateOfBirth)
      )
    )
  );

  const agesToRender = _.range(
    _.minBy(agesSorted) ?? 0,
    (_.maxBy(agesSorted) ?? 0) + 2
  );

  const [TIMESTAMP_START, TIMESTAMP_END] =
    mode === "byArtist"
      ? [_.first(yearsToRender) ?? 0, _.last(yearsToRender) ?? 0].map(
          (yearString) => new Date(yearString).valueOf()
        )
      : [_.first(agesToRender) ?? 0, _.last(agesToRender) ?? 0].map(
          (numYears) => numYears * NUM_MS_IN_ONE_YEAR
        );

  const modes: Mode[] = ["byArtist", "byMember"];

  const ReleaseComponent: React.FC<{
    release: Release;
    numMsSinceStartTimestamp: number;
  }> = ({ numMsSinceStartTimestamp, release }) => (
    <>
      <div
        className="absolute w-2 h-2 bg-slate-500 border-2"
        data-for={`${release.artistId}_${release.title}`}
        data-tip
        style={{
          left: `${
            100 * (numMsSinceStartTimestamp / (TIMESTAMP_END - TIMESTAMP_START))
          }%`,
        }}
      />
      <ReactTooltip
        effect="float"
        id={`${release.artistId}_${release.title}`}
        place="top"
        type="dark"
      >
        <div>{release.artistId}</div>
        <div>{format(release.releaseDate, "yyyy-MM-dd (eee)")}</div>
        <div>{release.title}</div>
      </ReactTooltip>
    </>
  );

  return (
    <>
      <Head>
        <title>Timeline</title>
      </Head>
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
            {_.sortBy(
              Object.entries(releasesByArtist),
              ([, artistReleases]) =>
                _.minBy(artistReleases, (release) => release.releaseDate)
                  ?.releaseDate ?? 0
            ).flatMap(([artistId, artistReleases]) => [
              <div className="text-right" key={_.uniqueId("artistId")}>
                {artistNameByArtistId[artistId]}
              </div>,
              <div className="w-full" key={_.uniqueId("artistRelease")}>
                <div className="flex items-center">
                  <div className="w-full h-0 border-b-2"></div>
                </div>
                <div className="relative">
                  {artistReleases.map((release) => (
                    <ReleaseComponent
                      key={_.uniqueId("release")}
                      numMsSinceStartTimestamp={
                        release.releaseDate.valueOf() - TIMESTAMP_START
                      }
                      release={release}
                    />
                  ))}
                </div>
              </div>,
            ])}
          </>
        ) : (
          <>
            <div />
            <div className="flex gap-1 justify-between">
              {agesToRender.map((year) => (
                <div key={_.uniqueId("year")}>{year}</div>
              ))}
            </div>
            {_.sortBy(
              Object.entries(releasesByPersonId),
              ([personId, personReleases]) =>
                differenceInMilliseconds(
                  _.minBy(personReleases, (release) => release.releaseDate)
                    ?.releaseDate ?? 0,
                  personById[personId].dateOfBirth
                )
            ).flatMap(([personId, personReleases]) => [
              <div className="text-right" key={_.uniqueId("artistId")}>
                {personId}{" "}
                <span className="text-xs">
                  (
                  {artistIdsByPersonId[personId]
                    .map((artistId) => artistNameByArtistId[artistId])
                    .join(" | ")}
                  )
                </span>
              </div>,
              <div className="w-full" key={_.uniqueId("artistRelease")}>
                <div className="flex items-center">
                  <div className="w-full h-0 border-b-2"></div>
                </div>
                <div className="relative">
                  {personReleases.map((release) => (
                    <ReleaseComponent
                      key={_.uniqueId("release")}
                      numMsSinceStartTimestamp={
                        release.releaseDate.valueOf() -
                        personById[personId].dateOfBirth.valueOf() -
                        TIMESTAMP_START
                      }
                      release={release}
                    />
                  ))}
                </div>
              </div>,
            ])}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
