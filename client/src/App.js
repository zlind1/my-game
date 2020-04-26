import React from 'react';
import {Route, Link, Redirect} from 'react-router-dom';

let IN_DEV = false;
let awsApi = 'https://4enr01t30i.execute-api.us-west-1.amazonaws.com/dev';
let localApi = 'http://localhost:5000';
let apiUrl = (IN_DEV ? localApi : awsApi);
const crypto = require('crypto');

class App extends React.Component {
  constructor(props) {
    super(props)
    this.name = React.createRef();
    this.pass = React.createRef();
    this.state = {
      toPlay: false
    }
  }
  addUser = () => {
    var username = this.name.current.value;
    var password = crypto.createHmac('sha256', this.pass.current.value).digest('hex');
    var user = {
      username: username,
      password: password
    }
    fetch(apiUrl+'/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => res.json()
    .then(data => {
      if (data.success) this.setState({toPlay: true});
      else console.log('username taken');
    }))
  }
  loginUser = () => {
    var username = this.name.current.value;
    var password = crypto.createHmac('sha256', this.pass.current.value).digest('hex');
    var user = {
      username: username,
      password: password
    }
    fetch(apiUrl+'/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => res.json()
    .then(data => {
      if (data.success) this.setState({toPlay: true});
      else console.log('login failure');
    }))
  }
  render() {
    if (this.state.toPlay) {
      this.setState({toPlay: false});
      return(<Redirect to='/play' />);
    }
    return (
      <div className='App'>
        <Route exact path='/'>
          <Link to='/login'>
            Login
          </Link>
          <Link to='/signup'>
            Signup
          </Link>
        </Route>
        <Route exact path='/login'>
          <input ref={this.name} placeholder='username'/>
          <input ref={this.pass} type='password' placeholder='password'/>
          <button onClick={this.loginUser}>Log in</button>
        </Route>
        <Route exact path='/signup'>
          <input ref={this.name} placeholder='username'/>
          <input ref={this.pass} type='password' placeholder='password'/>
          <button onClick={this.addUser}>Sign up</button>
        </Route>
        <Route exact path='/play'>
          Play
        </Route>
      </div>
    );
  }
}

export default App;
