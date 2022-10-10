import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';


import {LoginProvider} from './LoginContext'
import Form from './components/form';
import Responses from './components/responses';
import CreateForm from './components/createForm';





ReactDOM.render(
  
  <LoginProvider>
  <HashRouter>
  <Routes className="main">
    <Route path="/" element={<App/>}>
      <Route path="/createForm" element={<CreateForm/>}/>
      <Route path="/:cid" element={<Form/>}/>
      <Route path="/responses" element={<Responses/>}/>

    </Route>
  </Routes>
  
</HashRouter>
</LoginProvider>

  , document.getElementById('root'));

