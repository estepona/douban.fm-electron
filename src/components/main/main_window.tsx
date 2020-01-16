import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LeftColumn from './left_column';
import MiddleColumn from './middle_column';
import RightColumn from './right_column';
import style from '../../asset/style/style.css';

export interface MainWindowState {
  loggedIn: boolean;
  paused: boolean;
}

export class MainWindow extends React.Component<{}, MainWindowState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: false,
      paused: true,
    };

    this.handlePausePlayButtonOnClick = this.handlePausePlayButtonOnClick.bind(this);
  }

  handlePausePlayButtonOnClick() {
    this.setState({ paused: !this.state.paused });
  }

  render() {
    return (
      <div className={`${style.lv1Container} ${style.lv1ContainerMain}`}>
        <LeftColumn paused={this.state.paused} pausePlayButtonOnClick={this.handlePausePlayButtonOnClick} />
        <MiddleColumn />
        <RightColumn />
      </div>
    );
  }
}

ReactDOM.render(<MainWindow />, document.getElementById('main'));
