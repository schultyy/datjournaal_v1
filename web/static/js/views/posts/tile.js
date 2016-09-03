import React from 'react';
import moment from 'moment';

export class TileComponent extends React.Component {
  render() {
    let { description, imageUrl, postedAt } = this.props;

    let date = moment(postedAt).calendar();

    return (
      <div className="row tile">
        <div className="col-xs-12">
          <img className="img-responsive" src={imageUrl} />
          <div>description: {description}</div>
          <div>posted at: {date}</div>
        </div>
      </div>
    );
  }
}
