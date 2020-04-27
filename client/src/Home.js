import React from 'react';
import {Container, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Home extends React.Component {
  render() {
    return(
      <Container className='bg-secondary text-center'>
        <h1>Games by ZLIND</h1>
        {this.props.user !== '' ? (
          <>
            <p>You are logged in as {this.props.user}</p>
            <Link to='/play'>
              Play
            </Link>
            <br/>
            <Link to='/' onClick={this.props.signout}>
              Sign out
            </Link>
          </>
        ) : (
          <>
            <p>You need an account to play</p>
            <Button as={Link} to='/login'>
              Log in
            </Button>
            {' or '}
            <Button as={Link} to='/signup'>
              Sign up
            </Button>
          </>
        )}
      </Container>
    );
  }
}

export default Home;
