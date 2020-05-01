import React from 'react';
import {Route} from 'react-router-dom';
import Home from './Home.js';
import Login from './Login.js';
import Play from './Play.js';
import TicTacToe from './TicTacToe.js';
import Snake from './Snake.js';

let IN_DEV = false;
let awsApi = 'https://4enr01t30i.execute-api.us-west-1.amazonaws.com/dev';
let localApi = 'http://localhost:5000';
let apiUrl = (IN_DEV ? localApi : awsApi);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  loadUserProfile = user => {
    document.cookie = 'user='+user.username;
    this.setState({user: user});
  }
  signout = () => {
    fetch(apiUrl+'/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action: 'logout', user: this.state.user})
    }).then(res => res.json()
    .then(data => {
      if (data.success) {
        document.cookie = 'user=;max-age=0';
        this.setState({user: null});
      } else {
        console.log(data.message);
        console.log('not logged out');
      }
    }));
  }
  componentDidMount() {
    const cookies = document.cookie.split(';')
    for (var cookie of cookies) {
      var index = cookie.indexOf('user=');
      if (index !== -1) {
        fetch(apiUrl+'/users?name='+cookie.substring(index+5))
        .then(res => res.json().then(data => {
          this.loadUserProfile(data.user);
        }));
        return;
      }
    }
  }
  render() {
    return (
      <div className='App'>
        <Route exact path='/'>
          <Home user={this.state.user} load={this.loadUserProfile}
           signout={this.signout}/>
        </Route>
        <Route exact path='/login'>
          <Login login={true} load={this.loadUserProfile}/>
        </Route>
        <Route exact path='/signup'>
          <Login login={false} load={this.loadUserProfile}/>
        </Route>
        <Route exact path='/play'>
          <Play user={this.state.user} signout={this.signout}/>
        </Route>
        <Route exact path='/tictactoe'>
          <TicTacToe />
        </Route>
        <Route exact path='/snake'>
          <Snake />
        </Route>
      </div>
    );
  }
}

export default App;
