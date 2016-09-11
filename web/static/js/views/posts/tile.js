import React from 'react';
import moment from 'moment';

export class TileComponent extends React.Component {
  render() {
    let { description, imageUrl, postedAt, userHandle, onDoubleClick } = this.props;

    let date = moment(postedAt).calendar();

    return (
      <div className="tile" onDoubleClick={onDoubleClick}>
        <div>
          <span className="pull-left">{userHandle}</span>
          <span className="pull-right">{date}</span>
        </div>
        <img src={imageUrl} />
        <div className="description">{description}</div>
      </div>
    );
  }
}
