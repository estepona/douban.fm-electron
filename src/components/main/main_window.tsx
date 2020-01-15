import * as React from 'react';
import * as ReactDOM from 'react-dom';
import LeftColumn from './left_column';
import style from '../../asset/style/style.css';

export interface HelloProps {
  compiler: string;
  framework: string;
}

export class MainWindow extends React.Component<HelloProps, {}> {
  render() {
    return (
      <div className={`${style['lv1-container']} ${style['lv1-container-main']}`}>
        <LeftColumn />
      </div>
    );
  }
}

ReactDOM.render(<MainWindow compiler='webpack' framework='react' />, document.getElementById('main'));
