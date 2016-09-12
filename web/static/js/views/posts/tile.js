import React from 'react';
import moment from 'moment';
import ContextMenu from './contextmenu';

export class TileComponent extends React.Component {
  render() {
    let {
      description,
      imageUrl,
      postedAt,
      userHandle,
      onDoubleClick,
    } = this.props;

    let date = moment(postedAt).calendar();

    return (
      <div className="tile" onDoubleClick={onDoubleClick}>
        <div>
          <span className="pull-left">{userHandle}</span>
          <span className="pull-right">
            <ContextMenu onShowDetail={onDoubleClick} />
          </span>
        </div>
        <img src={imageUrl} />
        <div className="date">{date}</div>
        <div className="description">{description}</div>
      </div>
    );
  }
}
