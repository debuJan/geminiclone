import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './Main';
import ContextProvider from "./context/context.jsx";
import './index.css';

const App = () => {
  return (
    <ContextProvider>
      <Sidebar />
      <Main />
    </ContextProvider>
  );
};

export default App;
