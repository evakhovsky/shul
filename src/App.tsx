import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationBar from './components/ApplicationBar'
import LoginComponent from './components/authentication/Login';
import Register from './components/authentication/Register';
import RegistrationConfirmationComponent from './components/authentication/RegistrationConfirm';
import ForgotCredentials from './components/authentication/ForgotCredentials';
import PasswordReset from './components/authentication/PasswordReset';
import PasswordResetWasSent from './components/authentication/PasswordResetWasSent';
import { AppBarProvider } from './components/shared/AppBarContext';

function App() {
  const routesMap = { 
    login: "/login",
    register: "/register",
    registerConfirmation: "/registerConfirmation",
    forgotCredentials: '/forgotCredentials',
    passwordReset: '/passwordReset',
    passwordResetWasSent: '/passwordResetWasSent'
  };

  return (
    <>
      <div className="app">
        <AppBarProvider>
          <Router>          
              <ApplicationBar/>          
            <Routes>
              <Route path={routesMap.login} element={<LoginComponent />} />
              <Route path={routesMap.register} element={<Register />} />
              <Route path={routesMap.registerConfirmation} element={<RegistrationConfirmationComponent />} />
              <Route path={routesMap.forgotCredentials} element={<ForgotCredentials />} />
              <Route path={routesMap.passwordReset} element={<PasswordReset />} />
              <Route path={routesMap.passwordResetWasSent} element={<PasswordResetWasSent />} />
            </Routes>
          </Router>
        </AppBarProvider>
      </div>
    </>
  );
}

export default App;
