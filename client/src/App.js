import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      response: null
    }
  }
  componentDidMount() {
    fetch('https://4enr01t30i.execute-api.us-west-1.amazonaws.com/dev')
    .then(res => res.json()
    .then(data => this.setState({response: data})));
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
      </div>
    );
  }
}

export default App;
