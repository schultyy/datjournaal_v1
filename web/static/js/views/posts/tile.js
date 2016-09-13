import React from 'react';
import moment from 'moment';
import ContextMenu from './contextmenu';
import {absoluteUrlForPost} from '../../utils';

export class TileComponent extends React.Component {
  onCopyURLToClipboard() {
    const { id } = this.props;
    return absoluteUrlForPost(id);
  }

  render() {
    let {
      id,
      description,
      imageUrl,
      postedAt,
      userHandle,
      onDoubleClick,
      isDetailMode,
    } = this.props;

    let date = moment(postedAt).calendar();

    if (isDetailMode) {
      var doubleClickHandler = null;
    }
    else {
      var doubleClickHandler = onDoubleClick;
    }

    return (
      <div className="tile" onDoubleClick={onDoubleClick}>
        <div>
          <span className="pull-left">{userHandle}</span>
          <span className="pull-right">
            <ContextMenu
              onCopyURLToClipboard={this.onCopyURLToClipboard.bind(this)}
              onShowDetail={doubleClickHandler} />
          </span>
        </div>
        <img src={imageUrl} />
        <div className="date">{date}</div>
        <div className="description">{description}</div>
      </div>
    );
  }
}
