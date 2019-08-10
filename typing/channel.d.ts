declare interface ChannelCreator {
  url: Url;
  name: string;
  id: number;
}

declare interface Channel {
  id: ChannelId;
  name: string;
  intro: string;
  creator: ChannelCreator;
  rec_reason: string;
  banner: Url;
  cover: Url;
  song_to_start?: string;
  song_num: number;
  collected: string;
  hot_songs: string[];

  artists?: Artist[];
  related_artists?: ArtistShort[];
}

declare interface RecChannels {
  status: boolean;
  data: {
    channels: {
      scenario: Channel[];
      language: Channel[];
      artist: Channel[];
      track: Channel[];
      brand: Channel[];
      genre: Channel[];
    };
  };
}
