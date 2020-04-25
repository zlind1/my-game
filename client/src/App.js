import React from 'react';

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
      if (data.success) console.log('user added');
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
      if (data.success) console.log('login success');
      else console.log('login failure');
    }))
  }
  render() {
    return (
      <div className="App">
        <input ref={this.name} placeholder='username'/>
        <input ref={this.pass} type='password' placeholder='password'/>
        <button onClick={this.loginUser}>Log in</button>
        <button onClick={this.addUser}>Sign up</button>
      </div>
    );
  }
}

export default App;
