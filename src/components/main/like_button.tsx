import * as React from 'react';

import whiteLikeButton from '../../asset/icon/like-button-white.svg';
import blackLikeButton from '../../asset/icon/like-button-black.svg';
import redLikeButton from '../../asset/icon/like-button-red.svg';
import style from '../../asset/style/style.css';

interface LikeButtonProps {
  liked: boolean;
  likeButtonOnClick(): void;
}

interface LikeButtonState {
  src: string;
}

export default class LikeButton extends React.Component<LikeButtonProps, LikeButtonState> {
  constructor(props: LikeButtonProps) {
    super(props);
    this.state = {
      src: whiteLikeButton,
    };

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnMouseOver(e: React.MouseEvent) {
    e.preventDefault();

    this.setState({ src: blackLikeButton });
  }

  handleOnMouseOut(e: React.MouseEvent) {
    e.preventDefault();

    if (this.props.liked) {
      this.setState({ src: redLikeButton });
    } else {
      this.setState({ src: whiteLikeButton });
    }
  }

  handleOnClick(e: React.MouseEvent) {
    e.preventDefault();

    const prevLiked = this.props.liked;
    this.props.likeButtonOnClick();

    if (prevLiked) {
      this.setState({ src: whiteLikeButton });
    } else {
      this.setState({ src: redLikeButton });
    }
  }

  render() {
    return (
      <img
        className={`${style.rightColDownButton} ${style.nonDraggable}`}
        src={this.state.src}
        onMouseOver={this.handleOnMouseOver}
        onMouseOut={this.handleOnMouseOut}
        onClick={this.props.likeButtonOnClick}
      />
    );
  }
}
