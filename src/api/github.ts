import Axios from 'axios';

class Client {
  /**
   * doc: https://developer.github.com/v3/repos/releases/
   */
  public async getReleases(): Promise<GithubReleaseResponse[]> {
    return Axios.get('https://api.github.com/repos/estepona/douban.fm-electron/releases')
      .then(res => res.data)
      .catch(err => {
        throw Error('getReleases request failed');
      });
  }
}

export default new Client();
