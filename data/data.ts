export interface Artist {
  members: Person[];
  id: string;
  name: string;
}

export interface Person {
  id: string;
  name: string;
  dateOfBirth: Date;
}

export interface Release {
  artistId: string;
  releaseDate: Date;
  title: string;
}

export const getArtists = (): Promise<Artist[]> =>
  Promise.resolve([
    {
      id: "Billie Eilish",
      members: [
        {
          dateOfBirth: new Date("December 18, 2001"),
          id: "Billie Eilish",
          name: "Billie Eilish",
        },
      ],
      name: "Billie Eilish",
    },
    {
      id: "3WrFJ7ztbogyGnTHbHJFl2",
      members: [
        {
          dateOfBirth: new Date("October 9, 1940"),
          id: "John Lennon",
          name: "John Lennon",
        },
        {
          dateOfBirth: new Date("June 18, 1942"),
          id: "Paul McCartney",
          name: "Paul McCartney",
        },
        {
          dateOfBirth: new Date("February 25, 1943"),
          id: "George Harrison",
          name: "George Harrison",
        },
        {
          dateOfBirth: new Date("July 7, 1940"),
          id: "Ringo Starr",
          name: "Ringo Starr",
        },
      ],
      name: "The Beatles",
    },
    {
      id: "Itzy",
      members: [
        { dateOfBirth: new Date("May 26, 2000"), id: "Yeji", name: "Yeji" },
        { dateOfBirth: new Date("July 21, 2000"), id: "Lia", name: "Lia" },
        { dateOfBirth: new Date("December 9, 2003"), id: "Yuna", name: "Yuna" },
        {
          dateOfBirth: new Date("April 17, 2001"),
          id: "Ryujin",
          name: "Ryujin",
        },
        {
          dateOfBirth: new Date("June 5, 2001"),
          id: "Chaeryeong",
          name: "Chaeryeong",
        },
      ],
      name: "Sunmi",
    },
    {
      id: "Sunmi",
      members: [
        { dateOfBirth: new Date("May 2, 1992"), id: "이선미", name: "이선미" },
      ],
      name: "Sunmi",
    },
  ]);

export const getReleases = (): Promise<Release[]> =>
  Promise.resolve([
    {
      artistId: "Billie Eilish",
      releaseDate: new Date("March 29, 2019"),
      title: "When We All Fall Asleep, Where Do We Go?",
    },
    {
      artistId: "Billie Eilish",
      releaseDate: new Date("July 30, 2021"),
      title: "Happier Than Ever",
    },
    {
      artistId: "Itzy",
      releaseDate: new Date("29 July 2019"),
      title: "It's Icy",
    },
    { artistId: "Itzy", releaseDate: new Date("9 Mar 2020"), title: "It's Me" },
    {
      artistId: "Itzy",
      releaseDate: new Date("17 Aug 2020"),
      title: "Not Shy",
    },
    {
      artistId: "Itzy",
      releaseDate: new Date("30 Apr 2021"),
      title: "Guess Who",
    },
    {
      artistId: "Itzy",
      releaseDate: new Date("24 Sep 2021"),
      title: "Crazy In Love",
    },
    {
      artistId: "Sunmi",
      releaseDate: new Date("17 February 2014"),
      title: "Full Moon",
    },
    {
      artistId: "Sunmi",
      releaseDate: new Date("4 September 2018"),
      title: "Warning",
    },
    { artistId: "Sunmi", releaseDate: new Date("6 August 2021"), title: "1/6" },
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
      releaseDate: new Date("27 November 1967"),
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
