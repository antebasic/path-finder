import React from 'react';
import Grid from './Components/Grid';
import Header from './Components/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header></Header>
        <Grid></Grid>
      </header>
    </div>
  );
}

export default App;
