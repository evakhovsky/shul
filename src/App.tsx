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
import PayPalConfirmSubscription from './components/pages/PayPalConfirmSubscription';
import UserDonations from './components/pages/content/UserDonations';
import Account from './components/pages/Account';
import ContactUsComponent from './components/pages/ContactUs'
import ContactUsSuccess from './components/pages/ContactUsSuccess'
import UserDonationsNoAuthentication from './components/pages/content/UserDonationsNoAuthentication';

function App() {
  const getPaypClientID = ():string => {
    const entity = process.env.REACT_APP_SHUL;
    const clientIDPrefix = "REACT_APP_PAYPALCLIENTID_";
    const clientIDEntry = clientIDPrefix + entity;
    const clientID = process.env[clientIDEntry];
    
    return clientID ?? "";
  }

  const initialOptions = {
    clientId: getPaypClientID(), // Replace with your actual client ID (sandbox or production)
    currency: "USD",
    intent: "capture",
    vault: "true"
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
              <Route path={routesMap.payPalConfirmSubscription} element={<PayPalConfirmSubscription />} />
              <Route path={routesMap.userDonations} element={<UserDonations />} />
              <Route path={routesMap.account} element={<Account />} />
              <Route path={routesMap.contactUs} element={<ContactUsComponent />} />
              <Route path={routesMap.contactUsSuccess} element={<ContactUsSuccess />} />
              <Route path={routesMap.userDonationsNoAuthentication} element={<UserDonationsNoAuthentication />} />
            </Routes>
          </Router>
        </AppBarProvider>
        </PayPalScriptProvider>
      </div>
    </>
  );
}

export default App;