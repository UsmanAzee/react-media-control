import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from "@material-ui/styles";
import { HashRouter as Router } from "react-router-dom";
import Routes from "./routing/Routes";
import theme from './theme';
import { MyAppContext } from './context';
import { SnackbarProvider } from 'notistack';



function App() {
  const [ value, setValue ] = useState('initial context value');

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
      <Router>
        <MyAppContext.Provider value={{value, setValue}}>
          <Routes />
        </MyAppContext.Provider>
      </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
