import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

import { getNextSong } from '../../ipc/main';
import { doubanApiClient, githubApiClient } from '../../api';

import PausePlayButton from './pause_play_button';
import NextButton from './next_button';
import LikeButton from './like_button';
import MoreButton from './more_button';
import SongTitleText from './song_title_text';
import SongArtistAlbumText from './song_artist_album_text';
import SongTimeText from './song_time_text';
import style from '../../asset/style/style.css';

export interface MainWindowState {
  loggedIn: boolean;

  paused: boolean;
  liked: boolean;

  channel: number | 'liked';
  song?: Song;

  currentSec: number;
  totalSec: number;
}

export class MainWindow extends React.Component<{}, MainWindowState> {
  private videoRef = React.createRef<HTMLVideoElement>();

  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: true,

      paused: false,
      liked: false,

      channel: -10,
      song: undefined,

      currentSec: 0,
      totalSec: 0,
    };

    this.handleVideoOnTimeUpdate = this.handleVideoOnTimeUpdate.bind(this);
    this.handleVideoOnEnded = this.handleVideoOnEnded.bind(this);
    this.handlePausePlayButtonOnClick = this.handlePausePlayButtonOnClick.bind(this);
    this.handleNextButtonOnClick = this.handleNextButtonOnClick.bind(this);
    this.handleLikeButtonOnClick = this.handleLikeButtonOnClick.bind(this);
  }

  async componentDidMount() {
    try {
      await this.playDoubanSelectedSongOnStart();
    } catch {
      console.error();
    }

    if (this.videoRef.current) {
      this.videoRef.current.volume = 0.5;
    }
  }

  async playDoubanSelectedSongOnStart() {
    let song: Song | null = null;
    while (!song) {
      song = await doubanApiClient.getDoubanSelectedSong(true);
    }
    this.setState({ song });
  }

  async playNextSong() {
    let likedSongs: LikedSongs | null = null;
    if (this.state.channel === 'liked') {
      likedSongs = await doubanApiClient.getLikedSongs();
    }

    const { channel, song } = await getNextSong({ channel: this.state.channel, song: this.state.song }, likedSongs);
    this.setState({ channel, song });
  }

  handleVideoOnTimeUpdate() {
    if (this.state.song && this.videoRef.current) {
      this.setState({
        currentSec: this.videoRef.current.currentTime,
        totalSec: this.state.song.length,
      });
    }
  }

  async handleVideoOnEnded() {
    await this.playNextSong();
  }

  handlePausePlayButtonOnClick() {
    this.setState({ paused: !this.state.paused });

    if (this.state.paused) {
      this.videoRef.current?.play();
    } else {
      this.videoRef.current?.pause();
    }
  }

  async handleNextButtonOnClick() {
    await this.playNextSong();
  }

  handleLikeButtonOnClick() {
    if (this.state.loggedIn) {
      this.setState({ liked: !this.state.liked });
    }
  }

  handleMoreButtonOnClick() {
    return;
  }

  render() {
    return (
      <div className={`${style.lv1Container} ${style.lv1ContainerMain}`}>
        <div className={`${style.component} ${style.leftCol}`}>
          <PausePlayButton paused={this.state.paused} pausePlayButtonOnClick={this.handlePausePlayButtonOnClick} />
        </div>
        <div className={`${style.middleCol} ${style.component}`}>
          <SongTitleText title={this.state.song && this.state.song.title} />
          <SongArtistAlbumText text={this.state.song && `${this.state.song.artist}: ${this.state.song.albumtitle}`} />
          <video
            autoPlay
            height="0px"
            src={this.state.song ? this.state.song.url : ''}
            onTimeUpdate={this.handleVideoOnTimeUpdate}
            onEnded={this.handleVideoOnEnded}
            ref={this.videoRef}
          ></video>
        </div>
        <div className={`${style.component} ${style.rightCol}`}>
          <SongTimeText currentSec={this.state.currentSec} totalSec={this.state.totalSec} />
          <div className={style.rightColDown}>
            <NextButton nextButtonOnClick={this.handleNextButtonOnClick} />
            <LikeButton liked={this.state.liked} likeButtonOnClick={this.handleLikeButtonOnClick} />
            <MoreButton moreButtonOnClick={this.handleMoreButtonOnClick} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MainWindow />, document.getElementById('main'));
