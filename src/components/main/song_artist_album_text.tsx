import * as React from 'react';

import style from '../../asset/style/style.css';

interface SongArtistAlbumTextProps {
  text?: string;
}

export default class SongArtistAlbumText extends React.Component<SongArtistAlbumTextProps, {}> {
  private textRef = React.createRef<HTMLParagraphElement>();

  render() {
    let textOverflow = false;
    if (this.textRef.current) {
      if (this.textRef.current.scrollWidth > 155) {
        textOverflow = true;
      }
    }

    return (
      <p
        className={[
          style.baseText,
          style.baseTextSmallGrey,
          style.marquee,
          textOverflow && style.marqueeAnimation,
        ].join(' ')}
        ref={this.textRef}
      >
        {this.props.text ? this.props.text : ''}
      </p>
    );
  }
}
