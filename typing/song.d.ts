declare type SongFileExtension = 'mp3';

declare interface SongSource {
  confidence: number;
  source_full_name: string;
  file_url: Url | null;
  // source short name
  source: string;
  source_id: string;
  playable: boolean;
  page_url: Url;
}

declare interface Song {
  all_play_sources: SongSource;
  albumtitle: string;
  file_ext: SongFileExtension;
  album: string;
  ssid: string;
  title: string;
  subtype?: string;
  // SongId
  sid: string;
  sha256: string;
  status: number;
  picture: Url;
  update_time: Timestamp;
  alert_msg: string;
  is_douban_playable: boolean;
  public_time: string;
  partner_sources?: string[];
  singers: Artist[];
  artist: string;
  is_royal: boolean;
  // resource url
  url: Url;
  // length in seconds
  length: number;
  // album release info
  release: {
    ssid: string;
    title: string;
    cover: Url;
    link: Url;
    singers: ArtistShort[];
    // Number(AlbumId)
    id: number;
  };
  aid: AlbumId;
  // Number(kbps)
  kbps: string;
  // <kbps, unknown number>
  available_formats: Record<string, number>;
}
