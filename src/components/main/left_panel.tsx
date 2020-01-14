import * as React from 'react';

export default class LeftPanel extends React.Component<{ name: string }> {
  render() {
    return (
      <p>
        Hello from {this.props.name}!
      </p>
    );
  }
}
