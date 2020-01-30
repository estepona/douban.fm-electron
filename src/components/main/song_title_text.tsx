import * as React from 'react';

import style from '../../asset/style/style.css';

interface SongTitleTextProps {
  title?: string;
}

export default class SongTitleText extends React.Component<SongTitleTextProps, {}> {
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
        className={[style.baseText, style.marquee, textOverflow && style.marqueeAnimation].join(' ')}
        ref={this.textRef}
      >
        {this.props.title ? this.props.title : ''}
      </p>
    );
  }
}
