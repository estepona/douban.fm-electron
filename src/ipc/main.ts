export const getNextSong = async (event: Event, val: PlayerState | null) => {
  let channel: ChannelId | null = null;
  let song: Song | null = null;

  // determine channel
  if (!val) {
    channel = -10;
  } else if (val.channel === 'liked') {
    channel = null;
  } else {
    channel = val.channel;
  }

  // liked songs
  if (!channel) {
    if (!likedSongs) {
      likedSongs = await apiClient.getLikedSongs();
    }

    if (likedSongs && val && val.song && val.song.sid) {
      console.log(likedSongs.songs.length, 'xxx');

      const nextLikedSongIdx = likedSongs.songs.findIndex(s => val.song && s.sid === val.song.sid);
      const nextLikedSongShort =
        nextLikedSongIdx < likedSongs.songs.length - 1 ? likedSongs.songs[nextLikedSongIdx + 1] : null;

      if (nextLikedSongShort) {
        while (!song) {
          const songs = await apiClient.getSongs([nextLikedSongShort.sid]);
          song = songs[0];
        }
      }
    } else if (likedSongs) {
      console.log(likedSongs.songs.length, 'xxx');
      while (!song) {
        const songs = await apiClient.getSongs([likedSongs.songs[0].sid]);
        song = songs[0];
      }
    }
  }

  // channel songs
  if (channel) {
    if (val && val.song && val.song.sid) {
      song = await apiClient.getChannelSong(channel, false, val.song.sid);
    }

    while (!song) {
      song = await apiClient.getChannelSong(channel, true);
    }
  }

  console.log(`prev: ${val && val.song && val.song.title}, next: ${song && song.title}`);

  event.sender.send('main:receiveNextSong', {
    channel,
    song,
  });
});