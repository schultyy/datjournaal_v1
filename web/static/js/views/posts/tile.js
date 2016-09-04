import React from 'react';
import moment from 'moment';

export class TileComponent extends React.Component {
  render() {
    let { description, imageUrl, postedAt } = this.props;

    let date = moment(postedAt).calendar();

    return (
      <div className="tile">
        <div className="pull-right">{date}</div>
        <img src={imageUrl} />
        <div>description: {description}</div>
      </div>
    );
  }
}
