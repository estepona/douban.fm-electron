import * as React from 'react';
import whiteNextButton from '../../asset/icon/next-button-white.svg';
import whiteLikeButton from '../../asset/icon/like-button-white.svg';
import whiteMoreButton from '../../asset/more-button-horizontal-white.svg';
import style from '../../asset/style/style.css';

export default class RightColumn extends React.Component<{}> {
  render() {
    return (
      <div className={`${style.component} ${style.rightCol}`}>
        <p className={`${style.rightColUp} ${style.baseText} ${style.baseTextSmallGrey}`}></p>
        <div className={style.rightColDown}>
          <img className={`${style.rightColDownButton} ${style.nonDraggable}`} src={whiteNextButton} />
        </div>
      </div>
    );
  }
}
