import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationBar from './components/ApplicationBar'
import Register from './components/authentication/Register';
import RegistrationConfirmationComponent from './components/authentication/RegistrationConfirm';
import ForgotCredentials from './components/authentication/ForgotCredentials';
import PasswordReset from './components/authentication/PasswordReset';
import PasswordResetWasSent from './components/authentication/PasswordResetWasSent';
import { AppBarProvider } from './components/shared/AppBarContext';
import { routesMap } from './components/shared/routeConfig';
import Home from './components/pages/Home';

function App() {
  return (
    <>
      <div className="app">
        <AppBarProvider>
          <Router>          
              <ApplicationBar/>          
            <Routes>
              <Route path="/" element={<Navigate to={routesMap.home} />} />
              <Route path={routesMap.home} element={<Home />}/>
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
