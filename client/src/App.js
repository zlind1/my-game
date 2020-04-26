import React from 'react';
import {Route, Link} from 'react-router-dom';
import Login from './Login.js';

class App extends React.Component {
  render() {
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
          <Login login={true}/>
        </Route>
        <Route exact path='/signup'>
          <Login login={false}/>
        </Route>
        <Route exact path='/play'>
          Play
        </Route>
      </div>
    );
  }
}

export default App;
