import * as React from 'react';

import style from '../../asset/style/style.css';

interface SongTimeTextProps {
  currentSec: number;
  totalSec: number;
}

export default class SongTimeText extends React.Component<SongTimeTextProps, {}> {
  constructor(props: SongTimeTextProps) {
    super(props);

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
    const curMin = String(Math.floor(this.props.currentSec / 60)).padStart(2, '0');
    const curSec = String(Math.floor(this.props.currentSec % 60)).padStart(2, '0');
    const lenMin = String(Math.floor(this.props.totalSec / 60)).padStart(2, '0');
    const lenSec = String(Math.floor(this.props.totalSec % 60)).padStart(2, '0');
    const text = `${curMin}:${curSec} / ${lenMin}:${lenSec}`;

    console.log(text);

    return <p className={`${style.rightColUp} ${style.baseText} ${style.baseTextSmallGrey}`}>{text}</p>;
  }
}
