import React from 'react';

export class TileComponent extends React.Component {
  render() {
    let { description, imageUrl } = this.props;

    return (
      <div className="row tile">
        <div className="col-xs-12">
          <img className="image" src={imageUrl} />
          <div>description: {description}</div>
        </div>
      </div>
    );
  }
}
