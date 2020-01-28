import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PausePlayButton from './pause_play_button';
import NextButton from './next_button';
import LikeButton from './like_button';
import MoreButton from './more_button';
import SongTitleText from './song_title_text';
import SongArtistAlbumText from './song_artist_album_text';
import SongTimeText from './song_time_text';
import MiddleColumn from './middle_column';
import style from '../../asset/style/style.css';

export interface MainWindowState {
  loggedIn: boolean;

  paused: boolean;
  liked: boolean;

  title: string;
  artistAlbum: string;

  currentSec: number;
  totalSec: number;
}

export class MainWindow extends React.Component<{}, MainWindowState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: true,

      paused: true,
      liked: false,

      title: 'It was then the axiomatic clothes met the straight refuse.',
      artistAlbum: 'The momentous drop cannot bury the association.',

      currentSec: 0,
      totalSec: 0,
    };

    this.handlePausePlayButtonOnClick = this.handlePausePlayButtonOnClick.bind(this);
    this.handleNextButtonOnClick = this.handleNextButtonOnClick.bind(this);
    this.handleLikeButtonOnClick = this.handleLikeButtonOnClick.bind(this);
  }

  handlePausePlayButtonOnClick() {
    this.setState({ paused: !this.state.paused });
  }

  handleNextButtonOnClick() {
    return;
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
          <SongTitleText title={this.state.title} />
          <SongArtistAlbumText text={this.state.artistAlbum} />
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
