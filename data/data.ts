export interface Artist {
  id: string;
  name: string;
}

export const getArtists = (): Promise<Artist[]> =>
  Promise.resolve([
    { id: "b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d", name: "The Beatles" },
    { id: "48646387-1664-4c9a-9139-9bfd091b823c", name: "Blackpink" },
  ]);
