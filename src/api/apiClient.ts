import Axios from 'axios';

// TODO: put all urls in a separate place
class ApiClient {
  private clientId = '02646d3fb69a52ff072d47bf23cef8fd';
  private clientSecret = 'cde5d61429abcd7c';
  private headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

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

    const authRes: AuthInfo = await Axios.post(`https://www.douban.com/service/auth2/token?${authQueryString}`, null, {
      headers: this.headers,
    })
      .then(res => res.data)
      .catch(err => {
        if (err.response && err.response.data && err.response.data.msg) {
          throw Error(`${err.response.data.msg}`);
        } else {
          throw Error('unknown error');
        }
      });

    this.setAccessToken(authRes.access_token);

    return authRes;
  }

  /**
   * check with cache
   */
  public async checkLoggedin() {
    return;
  }

  public async getRecChannels(): Promise<RecChannels> {
    const channels: RecChannels = await Axios.post('https://douban.fm/j/v2/rec_channels?specific=all', null, {
      headers: this.headers,
    }).then(res => res.data);

    return channels;
  }

  public async getDoubanSelectedSong(isNew: boolean, nextSid?: SongId): Promise<Song> {
    const params = {
      channel: -10,
      app_name: 'radio_website',
      client: 's:mainsite|y:3.0',
      version: 100,
      type: isNew ? 'n' : 's',
      sid: nextSid || undefined,
    };

    const paramsString = Object.entries(params)
      .map(v => v.join('='))
      .join('&');

    const playlist: Playlist = await Axios.post(`https://fm.douban.com/j/v2/playlist?${paramsString}`, null, {
      headers: this.headers,
    }).then(res => res.data);

    return playlist.song[0];
  }

  public async getLikedSongs() {
    const liked = await Axios.post('https://api.douban.com/v2/fm/redheart/basic', null, {
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
  public async getSongs(songIds: SongId[]) {
    const songs: Song[] = await Axios.post(`https://api.douban.com/v2/fm/songs?sids=${songIds.join('|')}`, null, {
      headers: this.headers,
    }).then(res => res.data);

    return songs;
  }

  public async downloadSong() {
    return;
  }

  public async downloadPlaylist() {
    return;
  }
}

export default new ApiClient();
