import Axios from 'axios';

// TODO: put all urls in a separate place
class Client {
  private clientId = '02646d3fb69a52ff072d47bf23cef8fd';
  private clientSecret = 'cde5d61429abcd7c';
  private headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  /**
   * @param cookie e.g. bid=096SAMVgyFI
   */
  private setCookie(cookie: string) {
    Object.assign(this.headers, {
      Cookie: cookie,
    });
  }

  public setAccessToken(accessToken: string) {
    Object.assign(this.headers, {
      Authorization: `Bearer ${accessToken}`,
    });
  }

  public async login(username: string, password: string): Promise<AuthInfo> {
    const authReq: AuthQuery = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'password',
      username,
      password,
    };

    const authQueryString = Object.entries(authReq)
      .map(v => v.join('='))
      .join('&');

    const authInfo: AuthInfo = await Axios.post(`https://www.douban.com/service/auth2/token?${authQueryString}`, null, {
      headers: this.headers,
      withCredentials: true,
    })
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.data && err.response.data.msg) {
          throw Error(`${err.response.data.msg}`);
        } else {
          throw Error('unknown error');
        }
      });

    this.setAccessToken(authInfo.access_token);

    return authInfo;
  }

  /**
   * call rec channel api and get cookie
   */
  public async getAndSetCookie() {
    await Axios.post('https://api.douban.com/v2/fm/rec_channels?specific=all', null, {
      headers: this.headers,
    }).then(res => {
      if (res.headers['set-cookie']) {
        try {
          const cookie = res.headers['set-cookie'][0].split(';')[0];
          this.setCookie(cookie);
        } catch {
          console.log('failed to get and set cookie');
        }
      }
    });
  }

  public async getRecChannels(): Promise<RecChannels> {
    const channels: RecChannels = await Axios.post('https://api.douban.com/v2/fm/rec_channels?specific=all', null, {
      headers: this.headers,
    }).then(res => res.data);

    return channels;
  }

  public async getChannelSong(channelId: ChannelId, isNew: boolean, nextSid?: SongId): Promise<Song> {
    const params = {
      channel: channelId,
      app_name: 'radio_website',
      client: 's:mainsite|y:3.0',
      version: 100,
      type: isNew ? 'n' : 's',
      sid: nextSid || undefined,
    };

    const paramsString = Object.entries(params)
      .map(v => v.join('='))
      .join('&');

    const playlist: Playlist = await Axios.get(`https://api.douban.com/v2/fm/playlist?${paramsString}`, {
      headers: this.headers,
    }).then(res => res.data);

    return playlist.song[0];
  }

  public async getDoubanSelectedSong(isNew: boolean, nextSid?: SongId): Promise<Song> {
    return this.getChannelSong(-10, isNew, nextSid);
  }

  public async getLikedSongs(): Promise<LikedSongs | null> {
    const liked: LikedSongs = await Axios.post('https://api.douban.com/v2/fm/redheart/basic', null, {
      headers: this.headers,
    }).then(res => {
      if (res.status !== 200) { 
        return null;
      }
      return res.data;
    });

    return liked;
  }

  /**
   * get songs with specific songId(s)
   */
  public async getSongs(songIds: SongId[]): Promise<Song[]> {
    const songs: Song[] = await Axios.post(`https://api.douban.com/v2/fm/songs?sids=${songIds.join('|')}`, null, {
      headers: this.headers,
    }).then(res => res.data);

    return songs;
  }

  public async likeSong(songId: SongId) {
    const params = {
      channel: 0,
      app_name: 'radio_website',
      version: 100,
      type: 'r',
      sid: songId,
    };

    const paramsString = Object.entries(params)
      .map(v => v.join('='))
      .join('&');

    await Axios.post(`https://api.douban.com/v2/fm/playlist?${paramsString}`, null, {
      headers: this.headers,
    }).then(res => res.data);
  }

  public async unlikeSong(songId: SongId) {
    const params = {
      channel: 0,
      app_name: 'radio_website',
      version: 100,
      type: 'u',
      sid: songId,
    };

    const paramsString = Object.entries(params)
      .map(v => v.join('='))
      .join('&');

    await Axios.post(`https://api.douban.com/v2/fm/playlist?${paramsString}`, null, {
      headers: this.headers,
    }).then(res => res.data);
  }

  public async downloadSong() {
    throw Error('not implemented');
  }

  public async downloadPlaylist() {
    throw Error('not implemented');
  }
}

export default new Client();
