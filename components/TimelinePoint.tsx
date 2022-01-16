import { format } from "date-fns";
import React from "react";
import ReactTooltip from "react-tooltip";

import { Release } from "..";

export const TimelinePoint: React.FC<{
  artistName: string;
  rangeOffset: number;
  release: Release;
}> = ({ artistName, rangeOffset, release }) => (
  <>
    <div
      className="absolute w-2 h-2 bg-slate-500 border-2"
      data-for={`${release.artistId}_${release.title}`}
      data-tip
      style={{ left: `${100 * rangeOffset}%` }}
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
