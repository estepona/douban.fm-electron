declare type ISongFileExtension = 'mp3';

declare interface ISongSource {
  confidence: number,
  source_full_name: string,
  file_url: IUrl | null,
  // source short name
  source: string,
  source_id: string,
  playable: boolean,
  page_url: IUrl,
}

declare interface ISong {
  all_play_sources: ISongSource,
  albumtitle: string,
  file_ext: ISongFileExtension,
  album: string,
  ssid: string,
  title: string,
  subtype?: string,
  // SongId
  sid: string,
  sha256: string,
  status: number,
  picture: IUrl,
  update_time: Timestamp,
  alert_msg: string,
  is_douban_playable: boolean,
  public_time: string,
  partner_sources?: string[],
  singers: IArtist[],
  artist: string,
  is_royal: boolean,
  // resource url
  url: IUrl,
  // length in seconds
  length: number,
  // album release info
  release: {
    ssid: string,
    title: string,
    cover: IUrl,
    link: IUrl,
    singers: IArtistShort[],
    // Number(AlbumId)
    id: number,
  },
  aid: AlbumId,
  // Number(kbps)
  kbps: string,
  // <kbps, unknown number>
  available_formats: Record<string, number>,
}
