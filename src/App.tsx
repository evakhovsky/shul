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
import PayPal from './components/pages/PayPal';
import PayPalConfirm from './components/pages/PayPalConfirm';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  const initialOptions = {
  clientId: "AZLWMj61WLqE6bxOwVbUlXsw1hiNZDDMDJRlQOqw54XJ9ktmQanKCSYcl-o2MT_7PCzFJ2zAR0GSsU-b", // Replace with your actual client ID (sandbox or production)
  currency: "USD",
  intent: "capture",
};

  return (
    <>
      <div className="app">
        <PayPalScriptProvider options={initialOptions}>
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
              <Route path={routesMap.paypal} element={<PayPal />} />
              <Route path={routesMap.payPalConfirm} element={<PayPalConfirm />} />
            </Routes>
          </Router>
        </AppBarProvider>
        </PayPalScriptProvider>
      </div>
    </>
  );
}

export default App;
