import * as React from 'react';

import whiteNextButton from '../../asset/icon/next-button-white.svg';
import blackNextButton from '../../asset/icon/next-button-black.svg';
import style from '../../asset/style/style.css';

interface NextButtonProps {
  nextButtonOnClick(): void;
}

interface NextButtonState {
  src: string;
}

export default class NextButton extends React.Component<NextButtonProps, NextButtonState> {
  constructor(props: NextButtonProps) {
    super(props);
    this.state = {
      src: whiteNextButton,
    };

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
  }

  handleOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();

    this.setState({ src: blackNextButton });
  }

  handleOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();

    this.setState({ src: whiteNextButton });
  }

  render() {
    return (
      <img
        className={`${style.rightColDownButton} ${style.nonDraggable}`}
        src={this.state.src}
        onMouseOver={this.handleOnMouseOver}
        onMouseOut={this.handleOnMouseOut}
        onClick={this.props.nextButtonOnClick}
      />
    );
  }
}
