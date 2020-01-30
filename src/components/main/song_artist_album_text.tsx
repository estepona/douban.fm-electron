import * as React from 'react';

import style from '../../asset/style/style.css';

interface SongArtistAlbumTextProps {
  text?: string;
}

interface SongArtistAlbumTextState {
  textOverflow: boolean;
}

export default class SongArtistAlbumText extends React.Component<SongArtistAlbumTextProps, SongArtistAlbumTextState> {
  private textRef = React.createRef<HTMLParagraphElement>();

  constructor(props: SongArtistAlbumTextProps) {
    super(props);
    this.state = {
      textOverflow: false,
    };
  }

  componentDidMount() {
    if (this.textRef.current) {
      if (this.textRef.current.scrollWidth > 155) {
        this.setState({ textOverflow: true });
      } else {
        this.setState({ textOverflow: false });
      }
    }
  }

  componentWillUnmount() {
    this.setState({ textOverflow: false });
  }

  render() {
    return (
      <p
        className={[
          style.baseText,
          style.baseTextSmallGrey,
          style.marquee,
          this.state.textOverflow && style.marqueeAnimation,
        ].join(' ')}
        ref={this.textRef}
      >
        {this.props.text ? this.props.text : ''}
      </p>
    );
  }
}
