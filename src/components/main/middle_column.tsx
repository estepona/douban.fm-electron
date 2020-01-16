import * as React from 'react';
import whitePauseButton from '../../asset/icon/pause-button-white.svg';
import style from '../../asset/style/style.css';

export default class MiddleColumn extends React.Component<{}> {
  render() {
    return (
      <div className={`${style.component} ${style.middleCol}`}>
        <p className={`${style.songTitle} ${style.baseText} ${style.marquee}`}></p>
        <p className={`${style.baseText} ${style.baseTextSmallGrey} ${style.marquee}`}></p>
        <video></video>
      </div>
    );
  }
}
