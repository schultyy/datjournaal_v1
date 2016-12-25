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

  googleMapsUrl() {
    const { post } = this.props;
    return `http://maps.google.com?q=${post.lat},${post.lng}`;
  }

  renderLocation(post) {
    const hasCoordinates = post.lat && post.lng;
    if(post.short_location_name && hasCoordinates) {
      return (
        <div className="location">
          <a href={this.googleMapsUrl()} target="_blank">{post.short_location_name}</a>
        </div>
      );
    } else if(post.short_location_name && !hasCoordinates) {
      return (
        <div className="location">
          {post.short_location_name}
        </div>
      );
    } else {
      return null;
    }
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

    return (
      <div className={tileClasses} onDoubleClick={onDoubleClick}>
        <div>
          <span className="pull-left author">
            {post.user.handle}
            {this.renderLocation(post)}
          </span>
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
