import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {Container, Form, InputGroup, Button} from 'react-bootstrap'
import {FaUser, FaKey, FaEye} from 'react-icons/fa';

let IN_DEV = false;
let awsApi = 'https://4enr01t30i.execute-api.us-west-1.amazonaws.com/dev';
let localApi = 'http://localhost:5000';
let apiUrl = (IN_DEV ? localApi : awsApi);
const crypto = require('crypto');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.uref = React.createRef();
    this.pref = React.createRef();
    this.state = {
      toPlay: false
    }
  }
  UsernameInput = () => {
    return (
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <FaUser />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control ref={this.uref} placeholder='username'/>
        </InputGroup>
      </Form.Group>
    );
  }
  PasswordInput = () => {
    return (
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <FaKey />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control ref={this.pref} type='password' placeholder='password'/>
          <InputGroup.Append>
            <InputGroup.Text>
              <FaEye />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    );
  }
  loginUser = () => {
    var user = {
      username: this.uref.current.value,
      password: crypto.createHmac('sha256', this.pref.current.value).digest('hex')
    }
    fetch(apiUrl+'/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => res.json()
    .then(data => {
      if (data.success) {
        this.props.load(user.username);
        this.setState({toPlay: true});
      }
      else console.log('login failure');
    }))
  }
  addUser = () => {
    var user = {
      username: this.uref.current.value,
      password: crypto.createHmac('sha256', this.pref.current.value).digest('hex')
    }
    fetch(apiUrl+'/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => res.json()
    .then(data => {
      if (data.success) {
        this.props.load(user.username);
        this.setState({toPlay: true});
      }
      else console.log('username taken');
    }))
  }
  render() {
    if (this.state.toPlay) {
      return (<Redirect to='/play'/>);
    }
    return (
      <Container className='d-flex flex-column justify-content-between py-3'>
        <h1 className='align-self-center my-3'>
          {this.props.login ? 'Log in to play' : 'Create an account'}
        </h1>
        <Form className='text-center align-self-center my-3'>
          <this.UsernameInput />
          <this.PasswordInput />
          <Button onClick={this.props.login ? this.loginUser : this.addUser}
          className='w-100 my-3'>
            {this.props.login ? 'Log in' : 'Sign up'}
          </Button>
        </Form>
        <p className='align-self-center my-3'>
          {this.props.login ? 'No account yet? ' : 'Already have an account? '}
          {this.props.login ? (
            <Link to='/signup'>Sign up.</Link>
          ) : (
            <Link to='/login'>Log in.</Link>
          )}
        </p>
      </Container>
    );
  }
}

export default Login;
