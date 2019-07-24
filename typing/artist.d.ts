declare interface IArtistShort {
  id: string,
  name: string,
  cover?: IUrl,
}

declare interface IArtist {
  id: string,
  name: string,
  name_usual: string,
  avatar: IUrl,
  is_site_artist: boolean,
  related_site_id: number,
  style: string[],
  genre: string[],
  region: string[],
}