import * as React from 'react';

import style from '../../asset/style/style.css';

interface PausePlayButtonProps {
  paused: boolean;
  src: string;
  pausePlayButtonOnClick(e: React.MouseEvent): void;
  pausePlayButtonOnMouseOver(e: React.MouseEvent): void;
  pausePlayButtonOnMouseOut(e: React.MouseEvent): void;
}

export default class PausePlayButton extends React.Component<PausePlayButtonProps, {}> {
  render() {
    return (
      <img
        className={style.pausePlayButton}
        src={this.props.src}
        onMouseOver={this.props.pausePlayButtonOnMouseOver}
        onMouseOut={this.props.pausePlayButtonOnMouseOut}
        onClick={this.props.pausePlayButtonOnClick}
      />
    );
  }
}
