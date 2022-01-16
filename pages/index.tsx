import { Chip } from "@mui/material";
import axios from "axios";
import { getYear } from "date-fns";
import _ from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";

import { Release } from "..";
import { TimelinePoint } from "../components/TimelinePoint";
import { Artist, getArtists } from "../data/data";
import { shortenArray } from "../utils/utils";

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
  const timelineLengthInMs = TIMESTAMP_END - TIMESTAMP_START;

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
                  <TimelinePoint
                    artistName={artistNameByArtistId[release.artistId]}
                    key={_.uniqueId("release")}
                    rangeOffset={
                      (release.releaseDate.valueOf() - TIMESTAMP_START) /
                      timelineLengthInMs
                    }
                    release={release}
                  />
                ))}
              </div>
            </div>,
          ])}
        </div>
      </div>
    </>
  );
};

export default Home;
