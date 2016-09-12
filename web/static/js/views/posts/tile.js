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

        </div>
        <img src={imageUrl} />
        <div className="date">{date}</div>
        <div className="description">{description}</div>
      </div>
    );
  }
}
