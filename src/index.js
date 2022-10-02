import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';


import {LoginProvider} from './LoginContext'





ReactDOM.render(
  
  <LoginProvider>
  <HashRouter>
  <Routes className="main">
    <Route path="/" element={<App/>}>

    </Route>
  </Routes>
  
</HashRouter>
</LoginProvider>

  , document.getElementById('root'));

