import React, { Component } from 'react';
import logo from './logo.svg';

import Dedicated from './components/dedicated_servers/dedicated.js'; 

import './App.scss';

class App extends Component {
  render() {
    return (
      <Dedicated />
    );
  }
}

export default App;
