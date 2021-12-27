import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import { getReleases, Release } from "../data/data";
import styles from "../styles/Home.module.css";
import _ from "lodash";

const Home: NextPage = () => {
  const [releases, setReleases] = React.useState<Release[]>();

  useEffect(() => {
    getReleases().then(setReleases);
  }, []);

  return (
    <>
      {Object.entries(_.groupBy(releases, "artistId")).map(
        ([artistId, artistReleases]) => (
          <React.Fragment key={_.uniqueId("artist")}>
            <div>{artistId}</div>
            <div>{JSON.stringify(artistReleases)}</div>
          </React.Fragment>
        )
      )}
    </>
  );
};

export default Home;
