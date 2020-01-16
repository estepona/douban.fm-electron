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

interface LeftColumnProps {
  paused: boolean;
  pausePlayButtonOnClick(): void;
}

class PausePlayButton extends React.Component<PausePlayButtonProps, PausePlayButtonState> {
  constructor(props: PausePlayButtonProps) {
    super(props);
    this.state = {
      src: whitePauseButton,
    };

    this.handleButtonOnMouseOver = this.handleButtonOnMouseOver.bind(this);
    this.handleButtonOnMouseOut = this.handleButtonOnMouseOut.bind(this);
    this.handleButtonOnClick = this.handleButtonOnClick.bind(this);
  }

  handleButtonOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();

    if (this.props.paused) {
      this.setState({ src: blackPlayButton });
    } else {
      this.setState({ src: blackPauseButton });
    }
  }

  handleButtonOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();

    if (this.props.paused) {
      this.setState({ src: whitePlayButton });
    } else {
      this.setState({ src: whitePauseButton });
    }
  }

  handleButtonOnClick(e: React.MouseEvent) {
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
        onMouseOver={this.handleButtonOnMouseOver}
        onMouseOut={this.handleButtonOnMouseOut}
        onClick={this.handleButtonOnClick}
      ></img>
    );
  }
}

export default class LeftColumn extends React.Component<LeftColumnProps> {
  constructor(props: LeftColumnProps) {
    super(props);
  }

  render() {
    return (
      <div className={`${style.component} ${style.leftCol}`}>
        <PausePlayButton paused={this.props.paused} pausePlayButtonOnClick={this.props.pausePlayButtonOnClick} />
      </div>
    );
  }
}
