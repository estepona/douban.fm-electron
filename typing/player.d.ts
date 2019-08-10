declare interface PlayerState {
  channel: ChannelId | 'liked';
  song: Song;
  shuffle_liked?: boolean;
}
