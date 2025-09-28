import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationBar from './components/ApplicationBar'
import LoginComponent from './components/authentication/Login';
import Register from './components/authentication/Register';
import RegistrationConfirmationComponent from './components/authentication/RegistrationConfirm';

function App() {
  const routesMap = { 
    login: "/login",
    register: "/register",
    registerConfirmation: "/registerConfirmation"
  };

  return (
    <>
      <div className="app">
        <Router>
          <ApplicationBar/>
          <Routes>
            <Route path={routesMap.login} element={<LoginComponent />} />
            <Route path={routesMap.register} element={<Register />} />
            <Route path={routesMap.registerConfirmation} element={<RegistrationConfirmationComponent />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
