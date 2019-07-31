declare interface ArtistShort {
  id: string;
  name: string;
  cover?: Url;
}

declare interface Artist {
  id: string;
  name: string;
  name_usual: string;
  avatar: Url;
  is_site_artist: boolean;
  related_site_id: number;
  style: string[];
  genre: string[];
  region: string[];
}
