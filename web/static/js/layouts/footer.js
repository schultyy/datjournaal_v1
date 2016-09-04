import React from 'react';

export default class Footer extends React.Component {
  render() {
    const { newPostClick, currentUser } = this.props;

    if(!currentUser) {
      return false;
    }

    return (
      <div className="footer">
        <ul className="list-inline">
          <li><button onClick={newPostClick}>+</button></li>
        </ul>
      </div>
    );
  }
}
