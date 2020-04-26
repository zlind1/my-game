import React from 'react';
import {Route, Link} from 'react-router-dom';
import Home from './Home.js';
import Login from './Login.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
  }
  loadUserProfile = username => {
    document.cookie = 'user='+username;
    this.setState({username: username});
  }
  signout = () => {
    document.cookie = 'user=;max-age=0';
    this.setState({username: ''});
  }
  componentDidMount() {
    const cookies = document.cookie.split(';')
    for (var cookie of cookies) {
      var index = cookie.indexOf('user=');
      if (index !== -1) {
        this.loadUserProfile(cookie.substr(index+5));
        return;
      }
    }
    console.log('no user cookie saved');
  }
  render() {
    return (
      <div className='App'>
        <Route exact path='/'>
          <Home user={this.state.username} load={this.loadUserProfile}/>
        </Route>
        <Route exact path='/login'>
          <Login login={true} load={this.loadUserProfile}/>
        </Route>
        <Route exact path='/signup'>
          <Login login={false} load={this.loadUserProfile}/>
        </Route>
        <Route exact path='/play'>
          <p>You are playing as {this.state.username}</p>
          <Link to='/'>Home</Link>
          <br/>
          <Link to='/' onClick={this.signout}>
            Sign out
          </Link>
        </Route>
      </div>
    );
  }
}

export default App;
