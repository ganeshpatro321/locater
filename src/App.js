import React from 'react';
import GoogleSuggest from './GoogleSuggest';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      location : ''
    };
  }

  render(){
    return(
      <div className="App">
      <GoogleSuggest />
    </div>
    )
  }
}

export default App;
