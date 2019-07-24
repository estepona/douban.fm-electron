declare interface IChannelCreator {
  url: IUrl,
  name: string,
  id: number,
}

declare interface IChannel {
  id: number,
  name: string,
  intro: string,
  creator: IChannelCreator,
  rec_reason: string,
  banner: IUrl,
  cover: IUrl,
  song_to_start?: string,
  song_num: number,
  collected: string,
  hot_songs: string[],

  artists?: IArtist[],
  related_artists?: IArtistShort[],
}

declare interface IRecChannels {
  status: boolean,
  data: {
    channels: {
      scenario: IChannel[],
      language: IChannel[],
      artist: IChannel[],
      track: IChannel[],
      brand: IChannel[],
      genre: IChannel[],
    }
  },
}