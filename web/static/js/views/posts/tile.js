import React from 'react';
import moment from 'moment-timezone';
import ContextMenu from './contextmenu';
import {absoluteUrlForPost} from '../../utils';
import cx from 'classnames';

export class TileComponent extends React.Component {
  onCopyURLToClipboard() {
    const { post } = this.props;
    return absoluteUrlForPost(post);
  }

  render() {
    const {
      post,
      onDoubleClick,
      isDetailMode,
      onHide,
      onShow,
      isFirst
    } = this.props;
    let date = moment(`${post.inserted_at}Z`).tz('Europe/Berlin').format('DD.MM.YYYY HH:mm');

    if (isDetailMode) {
      var doubleClickHandler = null;
    }
    else {
      var doubleClickHandler = onDoubleClick;
    }

    const postIsHidden = post.hidden;

    const tileClasses = cx({
      tile: true,
      isHidden: postIsHidden,
      'detail-view': isDetailMode,
      'is-first': isFirst
    });

    console.log(tileClasses);

    return (
      <div className={tileClasses} onDoubleClick={onDoubleClick}>
        <div>
          <span className="pull-left author">{post.user.handle}</span>
          <span className="pull-right">
            <ContextMenu
              onCopyURLToClipboard={this.onCopyURLToClipboard.bind(this)}
              onShowDetail={doubleClickHandler}
              onHide={postIsHidden ? null : onHide}
              onShow={postIsHidden ? onShow : null} />
          </span>
        </div>
        <img src={post.image} />
        <div className="date">{date}</div>
        <div className="description">{post.description}</div>
      </div>
    );
  }
}
