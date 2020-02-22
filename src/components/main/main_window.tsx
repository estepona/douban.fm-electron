import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Mousetrap from 'mousetrap';
import { ipcRenderer } from 'electron';

import { ipcChannels, shortcut } from '../../config';
import { doubanApiClient, githubApiClient } from '../../api';
import { getNextSong } from '../../ipc/main';

import PausePlayButton from './pause_play_button';
import NextButton from './next_button';
import LikeButton from './like_button';
import MoreButton from './more_button';
import SongTitleText from './song_title_text';
import SongArtistAlbumText from './song_artist_album_text';
import SongTimeText from './song_time_text';

import whitePauseButton from '../../asset/icon/pause-button-white.svg';
import blackPauseButton from '../../asset/icon/pause-button-black.svg';
import whitePlayButton from '../../asset/icon/play-button-white.svg';
import blackPlayButton from '../../asset/icon/play-button-black.svg';
import style from '../../asset/style/style.css';

export interface MainWindowState {
  loggedIn: boolean;

  paused: boolean;
  liked: boolean;

  channel: number | 'liked';
  song?: Song;

  currentSec: number;
  totalSec: number;

  pausePlayButtonSrc: string;
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

      pausePlayButtonSrc: whitePauseButton,
    };

    this.handleVideoOnTimeUpdate = this.handleVideoOnTimeUpdate.bind(this);
    this.handleVideoOnEnded = this.handleVideoOnEnded.bind(this);
    this.handlePausePlayButtonOnClick = this.handlePausePlayButtonOnClick.bind(this);
    this.handlePausePlayButtonOnMouseOver = this.handlePausePlayButtonOnMouseOver.bind(this);
    this.handlePausePlayButtonOnMouseOut = this.handlePausePlayButtonOnMouseOut.bind(this);
    this.handleNextButtonOnClick = this.handleNextButtonOnClick.bind(this);
    this.handleLikeButtonOnClick = this.handleLikeButtonOnClick.bind(this);
  }

  async componentDidMount() {
    try {
      await this.playDoubanSelectedSongOnStart();
    } catch {
      console.log('main: fail to play selected song on start');
    }

    if (this.videoRef.current) {
      this.videoRef.current.volume = 0.5;
    }

    // bind ipcRenderers
    ipcRenderer.on(ipcChannels.app.loggedIn, () => this.setState({ loggedIn: true }));
    ipcRenderer.on(ipcChannels.app.notLoggedIn, () => this.setState({ loggedIn: false }));

    // bind keyboard events
    Mousetrap.bind(shortcut.shortcuts.pauseOrContinue, () => {
      if (this.state.paused) {
        this.setState({ paused: false, pausePlayButtonSrc: whitePauseButton });
        this.videoRef.current?.play();
      } else {
        this.setState({ paused: true, pausePlayButtonSrc: whitePlayButton });
        this.videoRef.current?.pause();
      }
    });
  }

  componentWillUnmount() {
    // unbind ipcRenderers
    [ipcChannels.app.loggedIn, ipcChannels.app.notLoggedIn].forEach(c => {
      ipcRenderer.removeAllListeners(c);
    });

    // unbind keyboard events
    Mousetrap.unbind(shortcut.shortcuts.pauseOrContinue);
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

  handlePausePlayButtonOnClick(e: React.MouseEvent) {
    e.preventDefault();

    if (this.state.paused) {
      this.setState({ paused: false, pausePlayButtonSrc: whitePauseButton });
      this.videoRef.current?.play();
    } else {
      this.setState({ paused: true, pausePlayButtonSrc: whitePlayButton });
      this.videoRef.current?.pause();
    }
  }

  handlePausePlayButtonOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();

    if (this.state.paused) {
      this.setState({ pausePlayButtonSrc: blackPlayButton });
    } else {
      this.setState({ pausePlayButtonSrc: blackPauseButton });
    }
  }

  handlePausePlayButtonOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();

    if (this.state.paused) {
      this.setState({ pausePlayButtonSrc: whitePlayButton });
    } else {
      this.setState({ pausePlayButtonSrc: whitePauseButton });
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
          <PausePlayButton
            paused={this.state.paused}
            src={this.state.pausePlayButtonSrc}
            onClick={this.handlePausePlayButtonOnClick}
            onMouseOver={this.handlePausePlayButtonOnMouseOver}
            onMouseOut={this.handlePausePlayButtonOnMouseOut}
          />
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
