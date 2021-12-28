import { getYear } from "date-fns";
import _ from "lodash";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";

import { getReleases, Release } from "../data/data";

type Mode = "byArtist" | "byMember";

const Home: NextPage = () => {
  const [releases, setReleases] = React.useState<Release[]>();
  const [mode, setMode] = React.useState<Mode>("byArtist");

  useEffect(() => {
    getReleases().then(setReleases);
  }, []);

  const releasesByArtist = _.groupBy(releases, "artistId");
  const yearsSorted = _.uniq(
    releases?.map((release) => `${getYear(release.releaseDate)}`)
  ).sort();

  const TIMESTAMP_START = new Date(yearsSorted?.[0] || Date.now()).valueOf();
  const TIMESTAMP_END = new Date(
    yearsSorted?.[yearsSorted?.length - 1] || Date.now()
  ).valueOf();

  const modes: Mode[] = ["byArtist", "byMember"];

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
            <div className="flex justify-between">
              {yearsSorted.map((year) => (
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
                      </div>
                    ))}
                  </div>
                </div>,
              ]
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default Home;
