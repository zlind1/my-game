import React from 'react';
import {Link} from 'react-router-dom';

class Home extends React.Component {
  componentDidMount() {
    const cookies = document.cookie.split(';')
    for (var cookie of cookies) {
      if (cookie.indexOf('user=') !== -1) {
        this.props.load(cookie.substr(6));
        return;
      }
    }
    console.log('no user cookie saved');
  }
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
