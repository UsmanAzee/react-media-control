import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from "@material-ui/styles";
import { HashRouter as Router } from "react-router-dom";
import Routes from "./routing/Routes";
import theme from './theme';
import { MyAppContext } from './context';



function App() {
  const [ value, setValue ] = useState('initial context value');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MyAppContext.Provider value={{value, setValue}}>
          <Routes />
        </MyAppContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
