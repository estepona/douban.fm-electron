import apiClient from '../api/client';

export const getNextSong = async (ps: PlayerState | null, ls?: LikedSongs | null): Promise<PlayerState> => {
  let channel: ChannelId | 'liked' | null = null;
  let song: Song | null = null;
  ls = ls || null;

  // determine channel
  if (!ps) {
    channel = -10;
  } else if (ps.channel === 'liked') {
    channel = 'liked';
  } else {
    channel = ps.channel;
  }

  // liked songs
  if (channel === 'liked') {
    if (!ls) {
      ls = await apiClient.getLikedSongs();
    }

    if (ls && ps && ps.song && ps.song.sid) {
      const nextLikedSongIdx = ls.songs.findIndex(s => ps.song && s.sid === ps.song.sid);
      const nextLikedSongShort = nextLikedSongIdx < ls.songs.length - 1 ? ls.songs[nextLikedSongIdx + 1] : null;

      if (nextLikedSongShort) {
        while (!song) {
          const songs = await apiClient.getSongs([nextLikedSongShort.sid]);
          song = songs[0];
        }
      }
    } else if (ls) {
      while (!song) {
        const songs = await apiClient.getSongs([ls.songs[0].sid]);
        song = songs[0];
      }
    }
  }

  // channel songs
  if (channel !== 'liked') {
    if (ps && ps.song && ps.song.sid) {
      song = await apiClient.getChannelSong(channel, false, ps.song.sid);
    }

    while (!song) {
      song = await apiClient.getChannelSong(channel, true);
    }
  }

  console.log(`prev: ${ps && ps.song && ps.song.title}, next: ${song && song.title}`);
  console.log(`prev: ${ps && ps.song && ps.song.sid}, next: ${song && song.sid}`);

  return {
    channel,
    song: song || undefined,
  };
};
