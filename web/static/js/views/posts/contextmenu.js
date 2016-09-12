import React from 'react';

export default class ContextMenuComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    }
  }
  renderMenuEntries() {
    return (
      <ul>
        <li><div className="entry">Show in detail</div></li>
        <li><div className="entry">Share on Twitter</div></li>
      </ul>
    );
  }
  onMenuClick() {
    const previousState = this.state.expanded;

    this.setState({
      expanded: !previousState
    });
  }
  render() {
    const expanded = this.state.expanded;

    return (
      <div className="menu">
        <span onClick={this.onMenuClick.bind(this)}>...</span>
        { expanded ? this.renderMenuEntries() : null }
      </div>
    );
  }
}
