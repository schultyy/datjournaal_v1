import React       from 'react';
import { connect } from 'react-redux';

class HomeIndexView extends React.Component {
  render() {
    return (
      <div className="container">
        Home
      </div>
    );
  }
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(HomeIndexView);
