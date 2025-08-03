import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import BootstrapNavbar from './components/BootstrapNavbar'

function App() {
  return (
    <>
      <div className="app">
        <Router>
          <BootstrapNavbar/>
        </Router>
      </div>
    </>
  );
}

export default App;
