import React from 'react';
import moment from 'moment-timezone';
import ContextMenu from './contextmenu';
import { absoluteUrlForPost } from '../../utils';
import cx from 'classnames';

export default class TileComponent extends React.Component {
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
    if (post.short_location_name && hasCoordinates) {
      return (
        <span className="header-control location">
          <a href={this.googleMapsUrl()} rel="noopener noreferrer" target="_blank">{post.short_location_name}</a>
        </span>
      );
    } else if (post.short_location_name && !hasCoordinates) {
      return (
        <span className="header-control location">
          {post.short_location_name}
        </span>
      );
    }
    return null;
  }

  render() {
    const {
      post,
      onDoubleClick,
      isDetailMode,
      onHide,
      onShow,
      onDelete,
      isFirst,
    } = this.props;
    const date = moment(`${post.inserted_at}Z`).tz('Europe/Berlin').format('DD.MM.YYYY HH:mm');

    if (isDetailMode) {
      var doubleClickHandler = null;
    } else {
      var doubleClickHandler = onDoubleClick;
    }

    const postIsHidden = post.hidden;

    const tileClasses = cx({
      tile: true,
      isHidden: postIsHidden,
      'is-first': isFirst,
      preview: !isDetailMode,
    });

    return (
      <div className={tileClasses} onDoubleClick={onDoubleClick}>
        <div className="header-controls">
          <span className="header-control author">
            {post.user.handle}
          </span>
          {this.renderLocation(post)}
        </div>
        <img src={post.image} />
        <div className="menu-bar">
            <ContextMenu
              onCopyURLToClipboard={this.onCopyURLToClipboard.bind(this)}
              onShowDetail={doubleClickHandler}
              onHide={postIsHidden ? null : onHide}
              onShow={postIsHidden ? onShow : null}
              onDelete={onDelete}
            />
        </div>
        { isDetailMode ?
          <div className="about">
            <div className="date">{date}</div>
            <div className="description">{post.description}</div>
          </div>
          : null
        }
      </div>
    );
  }
}
