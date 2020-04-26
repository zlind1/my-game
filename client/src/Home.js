import React from 'react';
import {Link} from 'react-router-dom';

class Home extends React.Component {
  render() {
    return (this.props.user !== '' ? (
      <>
        <p>You are logged in as {this.props.user}</p>
        <Link to='/play'>
          Play
        </Link>
      </>
    ) : (
      <>
        <p>You need an account to play</p>
        <Link to='/login'>
          Log in
        </Link>
        {' or '}
        <Link to='/signup'>
          Sign up
        </Link>
      </>
    ));
  }
}

export default Home;
