import React from 'react';
import {Container} from 'react-bootstrap';
import {Link, Redirect} from 'react-router-dom';

class Play extends React.Component {
  render() {
    return this.props.user == null ? <Redirect to='/'/> : (
      <Container className='bg-secondary text-center'>
        <h1>Play screen</h1>
        <p>You are playing as {this.props.user.username}</p>
        <Link to='/'>
          Home
        </Link>
        <br/>
        <Link to='/' onClick={this.props.signout}>
          Sign out
        </Link>
      </Container>
    );
  }
}

export default Play;
