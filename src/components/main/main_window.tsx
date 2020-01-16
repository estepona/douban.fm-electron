import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PausePlayButton from './pause_play_button';
import NextButton from './next_button';
import LikeButton from './like_button';
import MoreButton from './more_button';
import MiddleColumn from './middle_column';
import style from '../../asset/style/style.css';

export interface MainWindowState {
  loggedIn: boolean;
  paused: boolean;
  liked: boolean;
}

export class MainWindow extends React.Component<{}, MainWindowState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: true,
      paused: true,
      liked: false,
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
        <MiddleColumn />
        <div className={`${style.component} ${style.rightCol}`}>
          <p className={`${style.rightColUp} ${style.baseText} ${style.baseTextSmallGrey}`}></p>
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
