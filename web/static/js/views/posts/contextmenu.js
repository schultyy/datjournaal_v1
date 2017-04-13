import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class ContextMenuComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
  }
  renderMenuEntries() {
    const {
      onShowDetail,
      onShare,
      onHide,
      onDelete,
      onShow,
      onCopyURLToClipboard,
    } = this.props;
    const clipboardPayload = onCopyURLToClipboard();
    return (
      <ul>
        { onShowDetail ?
          <li onClick={onShowDetail}><div className="entry">Show in detail</div></li>
          : false
        }
        <li>
          <CopyToClipboard text={clipboardPayload}>
            <div className="entry">Copy URL</div>
          </CopyToClipboard>
        </li>
        {
          onDelete ?
            <li onClick={onDelete}><div className="entry">Delete this post</div></li>
          : false
        }
        {
          onShare ?
            <li onClick={onShare}><div className="entry">Share on Twitter</div></li>
          : false
        }
        {
          onHide ?
            <li onClick={onHide}><div className="entry">Hide this post</div></li>
          : false
        }
        {
          onShow ?
            <li onClick={onShow}><div className="entry">Show this post</div></li>
          : false
        }
      </ul>
    );
  }
  onMenuClick() {
    const previousState = this.state.expanded;

    this.setState({
      expanded: !previousState,
    });
  }
  render() {
    const expanded = this.state.expanded;

    return (
      <div className="menu">
        <span className="menu-text" onClick={this.onMenuClick.bind(this)}>...</span>
        { expanded ? this.renderMenuEntries() : null }
      </div>
    );
  }
}
