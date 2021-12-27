export interface Release {
  artistId: string;
  releaseDate: Date;
  title: string;
}

export const getReleases = (): Promise<Release[]> =>
  Promise.resolve([
    {
      artistId: "The Beatles",
      releaseDate: new Date("22 March 1963"),
      title: "Please Please Me",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("22 November 1963"),
      title: "With the Beatles",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("26 June 1964"),
      title: "A Hard Day's Night",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("4 December 1964"),
      title: "Beatles for Sale",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("6 August 1965"),
      title: "Help!",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("3 December 1965"),
      title: "Rubber Soul",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("5 August 1966"),
      title: "Revolver",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("26 May 1967"),
      title: "Sgt. Pepper's Lonely Hearts Club Band",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("27 November 1967[E]"),
      title: "Magical Mystery Tour",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("22 November 1968"),
      title: "The Beatles",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("13 January 1969"),
      title: "Yellow Submarine[D]",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("26 September 1969"),
      title: "Abbey Road",
    },
    {
      artistId: "The Beatles",
      releaseDate: new Date("8 May 1970"),
      title: "Let It Be",
    },
  ]);
