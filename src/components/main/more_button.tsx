import * as React from 'react';

import whiteMoreButton from '../../asset/icon/more-button-horizontal-white.svg';
import blackMoreButton from '../../asset/icon/more-button-horizontal-black.svg';
import style from '../../asset/style/style.css';

interface MoreButtonProps {
  moreButtonOnClick(): void;
}

interface MoreButtonState {
  src: string;
}

export default class MoreButton extends React.Component<MoreButtonProps, MoreButtonState> {
  constructor(props: MoreButtonProps) {
    super(props);
    this.state = {
      src: whiteMoreButton,
    };

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
  }

  handleOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();

    this.setState({ src: blackMoreButton });
  }

  handleOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();

    this.setState({ src: whiteMoreButton });
  }

  render() {
    return (
      <img
        className={`${style.rightColDownButton} ${style.nonDraggable}`}
        src={this.state.src}
        onMouseOver={this.handleOnMouseOver}
        onMouseOut={this.handleOnMouseOut}
        onClick={this.props.moreButtonOnClick}
      />
    );
  }
}
