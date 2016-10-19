import React from 'react';

export default class Footer extends React.Component {
  render() {
    const { newPostClick, showStatsClick, currentUser } = this.props;

    if(!currentUser) {
      return false;
    }

    return (
      <div className="footer">
        <ul className="list-inline">
          <li><button onClick={newPostClick}>+</button></li>
          <li><button className="show-stats" onClick={showStatsClick}>Stats</button></li>
        </ul>
      </div>
    );
  }
}
