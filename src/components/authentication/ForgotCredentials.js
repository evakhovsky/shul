import React, { useState } from 'react';
import './ForgotCredentials.css';
import Button from 'react-bootstrap/Button';
import authenticationService from '../shared/services/authentication.service'
import { Navigate } from "react-router-dom";

function ForgotCredentials(props) {
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isConfirmationRedirect, setConfirmationRedirect] = useState(false);    

    const handleEmailChange = async(event) => {
        let email = event.target.value;
        setEmail(email);        
        setErrors({invalidEmail: null});        
        
        if(!email){
            email = '';
            setIsEmailValid(false);
            return;
        }

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if(email.length < 4) {
            setErrors({invalidEmail: "Invalid email"})
            setIsEmailValid(false);
            return;
        }

        if (!pattern.test(email)) {
            setErrors({invalidEmail: "Invalid email"})
            setIsEmailValid(false);
            return;
        }

        setErrors({invalidEmail: null})
        setIsEmailValid(true);
    }

    const renderEmailLabel = () => {
        if (!isEmailValid) {
            return <div class="left"><label><b>Please enter your email below<span style={{color: "red"}}> *</span></b></label></div>;
        } else {
            return <div class="left"><label><b>Please enter your email below</b></label></div>;
        }
    }

    const isFormValidated = () => {
        return isEmailValid;
    }

    const renderRegistrationConfirmation = () => {
        if (isConfirmationRedirect) {
          return <Navigate to="/registerConfirmation" />;
        }
    }

    const handleSubmit = async event => {
        event.preventDefault();
        let result = await authenticationService.resetPassword(email);
        console.log(result);
        if(result.length > 1){
            setErrors({invalidEmail: result})
            setConfirmationRedirect(false);
            return;
        }

        setConfirmationRedirect(true);
    }

    return (
        <div>
            <h1>Forgot credentials</h1>
            {renderEmailLabel()}
            <div class="form-group">
            <input name="userId" placeholder="Email (required)" 
                                 onChange={handleEmailChange} value={email || ''}/>            
            </div> 
            <div>
                <Button style={{margin: "10px"}} onClick={handleSubmit} disabled = {!isFormValidated()}>Submit</Button>
            </div>
            <span style={{color: "red", margin: "10px"}}>{errors["invalidEmail"]}</span>            
            {renderRegistrationConfirmation()}
        </div>
    )
  }
  export default ForgotCredentials