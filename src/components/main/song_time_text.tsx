import * as React from 'react';

import style from '../../asset/style/style.css';

interface SongTimeTextProps {
  currentSec: number;
  totalSec: number;
}

interface SongTimeTextState {
  text: string;
}

export default class SongTimeText extends React.Component<SongTimeTextProps, SongTimeTextState> {
  constructor(props: SongTimeTextProps) {
    super(props);
    this.state = {
      text: '00:00 / 00:00',
    };

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
  }

  handleOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();
  }

  handleOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();
  }

  render() {
    return <p className={`${style.rightColUp} ${style.baseText} ${style.baseTextSmallGrey}`}>{this.state.text}</p>;
  }
}
