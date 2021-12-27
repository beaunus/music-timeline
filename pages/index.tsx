import _ from "lodash";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import ReactTooltip from "react-tooltip";

import { getReleases, Release } from "../data/data";

const Home: NextPage = () => {
  const [releases, setReleases] = React.useState<Release[]>();

  useEffect(() => {
    getReleases().then(setReleases);
  }, []);

  const TIMESTAMP_START = new Date("1963").valueOf();
  const TIMESTAMP_END = new Date("1971").valueOf();

  return (
    <div className="grid grid-cols-[max-content_auto] space-x-1 w-full">
      <div />
      <div className="flex justify-between">
        {[
          "1963",
          "1964",
          "1965",
          "1966",
          "1967",
          "1968",
          "1969",
          "1970",
          "1971",
        ].map((year) => (
          <div key={_.uniqueId("year")}>{year}</div>
        ))}
      </div>
      {Object.entries(_.groupBy(releases, "artistId")).flatMap(
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
                          (release.releaseDate.valueOf() - TIMESTAMP_START)) /
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
    </div>
  );
};

export default Home;
