import * as React from 'react';

import whitePauseButton from '../../asset/icon/pause-button-white.svg';
import blackPauseButton from '../../asset/icon/pause-button-black.svg';
import whitePlayButton from '../../asset/icon/play-button-white.svg';
import blackPlayButton from '../../asset/icon/play-button-black.svg';
import style from '../../asset/style/style.css';

interface PausePlayButtonProps {
  paused: boolean;
  pausePlayButtonOnClick(): void;
}

interface PausePlayButtonState {
  src: string;
}

export default class PausePlayButton extends React.Component<PausePlayButtonProps, PausePlayButtonState> {
  constructor(props: PausePlayButtonProps) {
    super(props);
    this.state = {
      src: whitePauseButton,
    };

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();

    if (this.props.paused) {
      this.setState({ src: blackPlayButton });
    } else {
      this.setState({ src: blackPauseButton });
    }
  }

  handleOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();

    if (this.props.paused) {
      this.setState({ src: whitePlayButton });
    } else {
      this.setState({ src: whitePauseButton });
    }
  }

  handleOnClick(e: React.MouseEvent) {
    e.preventDefault();

    const prevPaused = this.props.paused;
    this.props.pausePlayButtonOnClick();

    if (prevPaused) {
      this.setState({ src: whitePauseButton });
    } else {
      this.setState({ src: whitePlayButton });
    }
  }

  render() {
    return (
      <img
        className={style.pausePlayButton}
        src={this.state.src}
        onMouseOver={this.handleOnMouseOver}
        onMouseOut={this.handleOnMouseOut}
        onClick={this.handleOnClick}
      />
    );
  }
}
