import { connect } from 'react-redux';
import HomeIndexView from '../views/home';

const mapStateToProps = state => ({
  currentUser: state.session.currentUser,
  ...state.posts,
});

export default connect(mapStateToProps)(HomeIndexView);
