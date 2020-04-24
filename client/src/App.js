import React from 'react';

let apiUrl = 'https://4enr01t30i.execute-api.us-west-1.amazonaws.com/dev';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.name = React.createRef();
    this.pass = React.createRef();
    this.state = {
      response: null
    }
  }
  updateList = () => {
    fetch(apiUrl)
    .then(res => res.json()
    .then(data => this.setState({response: data})))
  }
  componentDidMount() {
    this.updateList();
  }
  addUser = () => {
    var username = this.name.current.value;
    var password = this.pass.current.value;
    var user = {
      username: username,
      password: password
    }
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res => res.json()
    .then(data => this.updateList()))
  }
  render() {
    return (
      <div className="App">
        {this.state.response != null ? this.state.response.map(
          user => (
            <>
              {user.username} {user.password} <br />
            </>
          )
        ) : 'null'}
        <input ref={this.name} placeholder='username'/>
        <input ref={this.pass} placeholder='password'/>
        <button onClick={this.addUser}>Add user</button>
      </div>
    );
  }
}

export default App;
