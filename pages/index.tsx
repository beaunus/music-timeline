import _ from "lodash";
import type { NextPage } from "next";
import React, { useEffect } from "react";

import { getReleases, Release } from "../data/data";

const Home: NextPage = () => {
  const [releases, setReleases] = React.useState<Release[]>();

  useEffect(() => {
    getReleases().then(setReleases);
  }, []);

  return (
    <>
      {Object.entries(_.groupBy(releases, "artistId")).map(
        ([artistId, artistReleases]) => (
          <div key={_.uniqueId("artist")}>
            <div>{artistId}</div>
            <div>{JSON.stringify(artistReleases)}</div>
          </div>
        )
      )}
    </>
  );
};

export default Home;
