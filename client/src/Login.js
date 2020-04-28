import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {Container, Form, InputGroup, Button} from 'react-bootstrap'
import {FaUser, FaKey, FaEye, FaEyeSlash} from 'react-icons/fa';

let IN_DEV = false;
let awsApi = 'https://4enr01t30i.execute-api.us-west-1.amazonaws.com/dev';
let localApi = 'http://localhost:5000';
let apiUrl = (IN_DEV ? localApi : awsApi);
const crypto = require('crypto');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.fref = React.createRef();
    this.uref = React.createRef();
    this.pref = React.createRef();
    this.state = {
      toPlay: false,
      passHidden: true,
      badAuth: false
    }
  }
  parseUser = () => {
    return {
      username: this.uref.current.value.toLowerCase(),
      password: crypto.createHmac('sha256', this.pref.current.value).digest('hex')
    }
  }
  checkForm = () => {
    if (this.fref.current.checkValidity()) {
      this.fref.current.classList.remove('was-validated');
      return true;
    }
    this.fref.current.classList.add('was-validated');
    return false;
  }
  loginUser = () => {
    if (!this.checkForm()) return;
    fetch(apiUrl+'/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action: 'login', user: this.parseUser()})
    }).then(res => res.json()
    .then(data => {
      if (data.success) {
        this.props.load(data.user);
        this.setState({toPlay: true});
      } else {
        console.log(data.message);
        this.setState({badAuth: true})
      }
    }))
  }
  addUser = () => {
    if (!this.checkForm()) return;
    fetch(apiUrl+'/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: this.parseUser()})
    }).then(res => res.json()
    .then(data => {
      if (data.success) {
        this.props.load(data.user);
        this.setState({toPlay: true});
      } else {
        console.log(data.message);
        this.setState({badAuth: true})
      }
    }))
  }
  togglePassword = () => {
    this.setState({passHidden: !this.state.passHidden});
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
          <Form.Control ref={this.uref} placeholder='username' required/>
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
          <Form.Control type={this.state.passHidden ? 'password' : 'text'}
          ref={this.pref} placeholder='password' required minLength={8}/>
          <InputGroup.Append>
            <InputGroup.Text onClick={this.togglePassword}>
              {this.state.passHidden ? <FaEye/> : <FaEyeSlash/>}
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    );
  }
  render() {
    if (this.state.toPlay) {
      return (<Redirect to='/play'/>);
    }
    return (
      <Container className='bg-secondary d-flex flex-column justify-content-between py-3'>
        <h1 className='align-self-center my-3'>
          {this.props.login ? 'Log in to play' : 'Create an account'}
        </h1>
        <Form ref={this.fref} className='text-center align-self-center my-3'
        noValidate>
          <this.UsernameInput />
          <this.PasswordInput />
          <Button onClick={this.props.login ? this.loginUser : this.addUser}
          className='w-100 my-3'>
            {this.props.login ? 'Log in' : 'Sign up'}
          </Button>
        </Form>
        <p hidden={!this.state.badAuth} className='align-self-center text-danger'>
          {this.props.login ? 'Bad login info, try again' : 'Username taken'}
        </p>
        <p className='align-self-center'>
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
