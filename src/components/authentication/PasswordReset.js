import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import authenticationService from '../shared/services/authentication.service'
import LoginDlg from './LoginDlg';
import queryString from 'query-string';

function PasswordReset() {
    const [password, setPassword] = useState('');
    const [isPasswordValid, setPasswordValid] = useState(true);
    const [isParseSuccess, setIsParseSuccess] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordValid, setConfirmPasswordValid] = useState(true);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [success, setsuccess] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handlePasswordChange = async(event) => {
        let password = event.target.value;
        setPassword(password);
        setErrors({passwordTooShort: null})
        
        if(!password){
          password = '';
          setPasswordValid(true);
          return;
        }
    
        if(password.length < 7){
          setErrors({passwordTooShort: 'Password is too short'})
          setPasswordValid(false);
          return;
        }
    
        setPasswordValid(true);
        let doMacth = doPasswordsMatch(password, confirmPassword);
        if(!doMacth){
          setErrors({confirmPasswordDoesnotMatch: "Passwords do not match"});
        }
        setConfirmPasswordValid(doMacth);
    }

    const handleConfirmPasswordChange = async(event) => {
      let confirmPassword = event.target.value;
      setConfirmPassword(confirmPassword);
      setErrors({confirmPasswordTooShort: null})
      
      if(!confirmPassword){
        confirmPassword = '';
        setConfirmPasswordValid(true);
        return;
      }
  
      if(confirmPassword.length < 7){
        setErrors({confirmPasswordTooShort: 'Confirm Password is too short'})
        setConfirmPasswordValid(false);
        return;
      }
  
      setConfirmPasswordValid(true);
      let doMacth = doPasswordsMatch(password, confirmPassword);
      if(!doMacth){
        setErrors({confirmPasswordDoesnotMatch: "Passwords do not match"});
      }
      setConfirmPasswordValid(doMacth);
  }

    const doPasswordsMatch = (password, confirmPassword) => {
      return password === confirmPassword;  
    }

    const renderPasswordLabel = () => {
      if(!password || password.length === 0)
      {
        return <div className="left"><label><b>Password<span style={{color: "red"}}> *</span></b></label></div>;
      }  

      if (!isPasswordValid) {
          return <div className="left"><label style={{color: "red"}}><b>Password</b></label></div>;
      } 
        
      return <div className="left"><label><b>Password</b></label></div>;
        
    }

    const renderSuccess = () => {
      if(success){
        console.log('renderSuccess');
        return (
        <div className="wrapper">
        <h5 style={{ color: 'blue' }}>Your password was successfuly reset</h5>
        <LoginDlg open={showLogin} 
              onClose={handleOnCloseLoginDlg}/>
        </div>
        )
      }
    }

    const renderConfirmPasswordLabel = () => {
      if(!confirmPassword || confirmPassword.length === 0)
      {
        return <div className="left"><label><b>Confirm Password<span style={{color: "red"}}> *</span></b></label></div>;
      }  

      if (!isPasswordValid) {
          return <div className="left"><label style={{color: "red"}}><b>Confirm Password</b></label></div>;
      } 
        
      return <div className="left"><label><b>Confirm Password</b></label></div>;        
    }

    const isFormValidated = () => {
      if(!password || !confirmPassword || !isParseSuccess || !email || !token){
        return false;
      }

      return (isPasswordValid && isConfirmPasswordValid && doPasswordsMatch(password, confirmPassword));
    }

    window.onload = function (){
      onPageLoad();      
    }

    const onPageLoad = () => {
      const parsed = queryString.parse(window.location.search);
      console.log(parsed);

      if(!parsed || !parsed.email || !parsed.token) {
          setIsParseSuccess(false);
          return;
      }

      setIsParseSuccess(true);

      setEmail(parsed.email);
      setToken(parsed.token);
    }

    const handleSubmit = async event => {
      event.preventDefault();
      let result = await authenticationService.resetCredentials(email, token, password);
      console.log(result);
      if(result.length > 2){
        setErrors({failure: result})
        return;
      }

      setsuccess(true);
      setShowLogin(true);
      console.log('success changing password');

    }

    const handleOnCloseLoginDlg = () => {
      console.log('handleOnCloseLoginDlg');
      setShowLogin(false);    
    };

    return (
        <div className="card">
            <div className="card-body">
            <h3 className="card-title">Reset Password</h3>
            <form>
                {renderPasswordLabel()}
                <input type="password" placeholder="Enter password (required)" 
                name="password" 
                onChange={handlePasswordChange} value={password || ''}
                required />
                {renderConfirmPasswordLabel()}
                <input type="password" placeholder="Confirm password (required)" 
                name="confirmPassword" 
                onChange={handleConfirmPasswordChange} value={confirmPassword || ''}
                required />
                <p></p>
                <span style={{color: "red"}}>{errors["passwordTooShort"]}</span>
                <span style={{color: "red"}}>{errors["confirmPasswordTooShort"]}</span>
                <span style={{color: "red"}}>{errors["confirmPasswordDoesnotMatch"]}</span>
                <span style={{color: "red"}}>{errors["failure"]}</span>
                <div className="left">
                <Button onClick={handleSubmit} disabled = {!isFormValidated()}>Submit</Button>
                <p>
                  {renderSuccess()}
                </p>
                </div>
            </form>
            </div>
        </div>
    )
}

export default PasswordReset