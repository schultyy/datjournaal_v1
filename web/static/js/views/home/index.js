import React       from 'react';
import { connect } from 'react-redux';

class HomeIndexView extends React.Component {
  render() {
    return (<div>Home</div>);
  }
}

const mapStateToProps = (state) => (
  state.boards
);

export default connect(mapStateToProps)(HomeIndexView);
