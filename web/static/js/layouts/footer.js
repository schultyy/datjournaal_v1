import React from 'react';

export default class Footer extends React.Component {
  render() {
    const { newPostClick } = this.props;

    return (
      <div className="footer">
        <ul className="list-inline">
          <li><button onClick={newPostClick}>+</button></li>
        </ul>
      </div>
    );
  }
}
