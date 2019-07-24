import Axios from "axios";

// TODO: put all urls in a separate place
class ApiClient {
  private clientId = "02646d3fb69a52ff072d47bf23cef8fd";
  private clientSecret = "cde5d61429abcd7c";
  private headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  public async login(username: string, password: string): Promise<IAuthInfo> {
    const authReq: IAuthQuery = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "password",
      username,
      password,
    };

    const authQueryString = Object.entries(authReq)
      .map((v) => v.join("="))
      .join("&");

    const authRes: IAuthInfo = await Axios.post(`https://www.douban.com/service/auth2/token?${authQueryString}`, null, {
      headers: this.headers,
    })
      .then((res) => res.data)
      .catch((err) => {
        try {
          return console.log(`douban.fm 登录失败, ${err.response.data.msg}`);
        } catch {
          return console.log("douban.fm 登录失败");
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

  public async getRecChannels(): Promise<IRecChannels> {
    const channels: IRecChannels = await Axios.post("https://douban.fm/j/v2/rec_channels?specific=all", null, {
      headers: this.headers,
    })
      .then((res) => res.data);

    return channels;
  }

  public async getRedheartSongs() {
    const redheart = await Axios.post("https://api.douban.com/v2/fm/redheart/basic", null, {
      headers: this.headers,
    })
      .then((res) => res.data);

    // TODO: if not logged in, show warning message; from 'update_time'
    return redheart;
  }

  public async getSongs(songIds: SongId[]) {
    const songs: ISong[] = await Axios.post(`https://api.douban.com/v2/fm/songs?sids=${songIds.join("|")}`, null, {
      headers: this.headers,
    })
      .then((res) => res.data);

    return songs;
  }

  public async downloadSong() {
    return;
  }

  public async downloadPlaylist() {
    return;
  }

  private setAccessToken(accessToken: string) {
    Object.assign(this.headers, {
      Authorization: `Bearer ${accessToken}`,
    });
  }
}

export default new ApiClient();
