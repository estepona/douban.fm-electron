declare interface Playlist {
  r: number;
  version_max: number;
  is_show_quick_start: number;
  warning?: string;
  song: Song[];
}

declare interface LikedSong {
  update_time: Timestamp;
  canonical_id: string;
  like: Liked;
  playable: boolean;
  sid: SongId;
}

declare interface LikedSongs {
  title: '我的红心歌曲';
  updated_time: string;
  is_collected: boolean;
  can_play: boolean;
  type: number;
  id: number;
  songs: LikedSong[];
}
