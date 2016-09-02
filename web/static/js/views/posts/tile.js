import React from 'react';

export class TileComponent extends React.Component {
  render() {
    let { description, imageUrl } = this.props;

    return (
      <div className="tile">
        <div className="col-xs-12">
          <img className="image" src={imageUrl} />
        </div>
        <div className="col-xs-12">
          description: {description}
        </div>
      </div>
    );
  }
}
