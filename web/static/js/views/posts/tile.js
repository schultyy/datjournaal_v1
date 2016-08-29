import React from 'react';

export class TileComponent extends React.Component {
  render() {
    return (
      <div className="tile">
        <div className="col-xs-12">
          <img className="image" src="http://placehold.it/300x300" />
        </div>
        <div className="col-xs-12">
          description: Dies und das
        </div>
      </div>
    );
  }
}
