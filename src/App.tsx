import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationBar from './components/ApplicationBar'
import LoginComponent from './components/authentication/Login';

function App() {
  const routesMap = { 
    login: "/login"
  };

  return (
    <>
      <div className="app">
        <Router>
          <ApplicationBar/>
          <Routes>
            <Route path={routesMap.login} element={<LoginComponent />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
