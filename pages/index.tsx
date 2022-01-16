import { Chip } from "@mui/material";
import axios from "axios";
import { format, getYear } from "date-fns";
import _ from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";

import { Release } from "..";
import { Artist, getArtists } from "../data/data";
import { shortenArray } from "../utils/utils";

const ReleaseComponent: React.FC<{
  artistName: string;
  numMsSinceStartTimestamp: number;
  range: { endTimestamp: number; startTimestamp: number };
  release: Release;
}> = ({
  artistName,
  numMsSinceStartTimestamp,
  range: { endTimestamp, startTimestamp },
  release,
}) => (
  <>
    <div
      className="absolute w-2 h-2 bg-slate-500 border-2"
      data-for={`${release.artistId}_${release.title}`}
      data-tip
      style={{
        left: `${
          100 * (numMsSinceStartTimestamp / (endTimestamp - startTimestamp))
        }%`,
      }}
    />
    <ReactTooltip
      effect="float"
      id={`${release.artistId}_${release.title}`}
      place="top"
      type="dark"
    >
      <div>{artistName}</div>
      <div>{format(release.releaseDate, "yyyy-MM-dd (eee)")}</div>
      <div>{release.title}</div>
    </ReactTooltip>
  </>
);

const Home: NextPage = () => {
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [releases, setReleases] = React.useState<Release[]>([]);
  const [artistNameByArtistId, setArtistNameByArtistId] = React.useState<
    Record<string, string>
  >({});

  useEffect(() => {
    getArtists().then(setArtists);
  }, []);

  useEffect(() => {
    setArtistNameByArtistId(_.mapValues(_.keyBy(artists, "id"), "name"));
  }, [artists]);

  useEffect(() => {
    Promise.all(
      artists.map(({ id }) =>
        axios
          .get<Release[]>(`/api/artist/${id}/releases`)
          .then(({ data }) => data)
      )
    ).then((arrayOfArraysOfReleases) =>
      setReleases(
        arrayOfArraysOfReleases.flat().map((release) => ({
          ...release,
          releaseDate: new Date(release.releaseDate),
        }))
      )
    );
  }, [artists]);

  const releasesByArtist = _.groupBy(releases, "artistId");

  const years = _.uniq(releases.map(({ releaseDate }) => getYear(releaseDate)));

  const yearsToRender = shortenArray(
    _.range(_.minBy(years) ?? 0, (_.maxBy(years) ?? 0) + 2).map(String),
    20
  );

  const [TIMESTAMP_START, TIMESTAMP_END] = [
    _.first(yearsToRender) ?? 0,
    _.last(yearsToRender) ?? 0,
  ].map((yearString) => new Date(yearString).valueOf());

  return (
    <>
      <Head>
        <title>Timeline</title>
      </Head>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div>Selected Artists</div>
          <div className="flex">
            {artists.map(({ name }) => (
              <Chip
                key={_.uniqueId("artistName")}
                label={name}
                variant="outlined"
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[max-content_auto] space-x-1 w-full">
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
                      artistName={artistNameByArtistId[release.artistId]}
                      key={_.uniqueId("release")}
                      numMsSinceStartTimestamp={
                        release.releaseDate.valueOf() - TIMESTAMP_START
                      }
                      range={{
                        endTimestamp: TIMESTAMP_END,
                        startTimestamp: TIMESTAMP_START,
                      }}
                      release={release}
                    />
                  ))}
                </div>
              </div>,
            ])}
          </>
        </div>
      </div>
    </>
  );
};

export default Home;
