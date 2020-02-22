import * as React from 'react';

import style from '../../asset/style/style.css';

interface PausePlayButtonProps {
  paused: boolean;
  src: string;
  onClick(e: React.MouseEvent): void;
  onMouseOver(e: React.MouseEvent): void;
  onMouseOut(e: React.MouseEvent): void;
}

export default class PausePlayButton extends React.Component<PausePlayButtonProps, {}> {
  render() {
    return (
      <img
        className={style.pausePlayButton}
        src={this.props.src}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onClick={this.props.onClick}
      />
    );
  }
}
