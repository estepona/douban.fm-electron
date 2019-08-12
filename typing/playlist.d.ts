declare interface Playlist {
  r: number;
  version_max: number;
  is_show_quick_start: number;
  warning?: string;
  song: Song[];
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
