import React from 'react';
import moment from 'moment-timezone';
import ContextMenu from './contextmenu';
import {absoluteUrlForPost} from '../../utils';

export class TileComponent extends React.Component {
  onCopyURLToClipboard() {
    const { post } = this.props;
    return absoluteUrlForPost(post.id);
  }

  render() {
    const {
      post,
      onDoubleClick,
      isDetailMode,
    } = this.props;
    let date = moment(`${post.inserted_at}Z`).tz('Europe/Berlin').format('DD.MM.YYYY HH:mm');

    if (isDetailMode) {
      var doubleClickHandler = null;
    }
    else {
      var doubleClickHandler = onDoubleClick;
    }

    return (
      <div className="tile" onDoubleClick={onDoubleClick}>
        <div>
          <span className="pull-left author">{post.user.handle}</span>
          <span className="pull-right">
            <ContextMenu
              onCopyURLToClipboard={this.onCopyURLToClipboard.bind(this)}
              onShowDetail={doubleClickHandler} />
          </span>
        </div>
        <img src={post.image} />
        <div className="date">{date}</div>
        <div className="description">{post.description}</div>
      </div>
    );
  }
}
