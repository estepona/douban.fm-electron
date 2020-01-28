import * as React from 'react';

import style from '../../asset/style/style.css';

interface SongTitleTextProps {
  title: string;
}

interface SongTitleTextState {
  textOverflow: boolean;
}

export default class SongTitleText extends React.Component<SongTitleTextProps, SongTitleTextState> {
  private textRef = React.createRef<HTMLParagraphElement>();

  constructor(props: SongTitleTextProps) {
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
        className={[style.baseText, style.marquee, this.state.textOverflow && style.marqueeAnimation].join(' ')}
        ref={this.textRef}
      >
        {this.props.title}
      </p>
    );
  }
}
