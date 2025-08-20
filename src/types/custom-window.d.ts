import LoginComponent from '../components/authentication/Login';

declare global {
      interface Window {
        helloComponent: LoginComponent;       
      }
    }