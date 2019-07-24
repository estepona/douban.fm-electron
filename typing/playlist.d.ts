declare interface IPlaylist {
  r: number,
  version_max: number,
  is_show_quick_start: number,
  warning?: string,
  song: ISong[],
}

// TODO: redheart