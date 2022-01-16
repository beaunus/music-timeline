export interface Artist {
  id: string;
  name: string;
}

export const getArtists = (): Promise<Artist[]> =>
  Promise.resolve([
    // { id: "b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d", name: "The Beatles" },
    { id: "48646387-1664-4c9a-9139-9bfd091b823c", name: "BLACKPINK" },
    { id: "bce172fc-51bb-43f7-9a25-b406a0a581d5", name: "ITZY" },
    { id: "716a8be4-6f58-4e64-a1e6-fb3017f21bf6", name: "SUNMI" },
    { id: "8da127cc-c432-418f-b356-ef36210d82ac", name: "TWICE" },
    { id: "0068ae6c-7156-40f9-a81f-39294af6a549", name: "(G)I‐DLE" },
    { id: "c62e0aeb-d7e2-406a-9036-d14881661e0e", name: "JEON SOYEON" },
    { id: "f4abc0b5-3f7a-4eff-8f78-ac078dbce533", name: "Billie Eilish" },
    { id: "35f3e736-e27b-4a26-892c-c00179d163d5", name: "K/DA" },
  ]);
