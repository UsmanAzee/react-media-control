import React from 'react';
import './App.css';
import { ThemeProvider } from "@material-ui/styles";
import theme from './theme';
import { Test } from './components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1>Simple react app</h1>
        <Test />
      </div>
    </ThemeProvider>
  );
}

export default App;
