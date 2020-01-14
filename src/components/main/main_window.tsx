import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LeftPanel from './left_panel';

export interface HelloProps {
  compiler: string;
  framework: string;
}

export class MainWindow extends React.Component<HelloProps, {}> {
  render() {
    return (
      <div>
        <h1>
          Hello from {this.props.compiler} and {this.props.framework}!
        </h1>
        <LeftPanel name='left panel' />
      </div>
    );
  }
}

ReactDOM.render(<MainWindow compiler='webpack' framework='react' />, document.getElementById('main'));
