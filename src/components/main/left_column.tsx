import * as React from 'react';
import whitePauseButton from '../../asset/icon/pause-button-white.svg';
import style from '../../asset/style/style.css';

export default class LeftColumn extends React.Component<{}> {
  render() {
    return (
      <div className={`${style['component']} ${style['col-left']}`}>
        <img className={`${style['pausePlayButton']}`} src={whitePauseButton} />
      </div>
    );
  }
}
