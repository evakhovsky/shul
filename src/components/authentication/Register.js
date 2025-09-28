import { useState } from 'react';
import './Register.css';
import { View } from 'react-native';
import Button from 'react-bootstrap/Button';
import helperUtil from '../shared/Util'
import { Navigate } from "react-router-dom";
import telephoneEntry from '../shared/TelephoneEntry'
import firstNameEntry from '../shared/FirstNameEntry'
import lastNameEntry from '../shared/LastNameEntry'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

function Register() {
  
  const handleUserIDChange = async(event) => {
    let userId = event.target.value;
    setUserId(userId);    

    if(!userId){
      userId = '';
      setErrors({userAlreadyPresent: null})      
      setErrors({userIdTooShort: null})
      setIsUserIdValid(true);
      return;
    }

    if(userId.length < 4){
      setErrors({userAlreadyPresent: null})
      setErrors({userIdTooShort: "User Id should be at least 4 characters long"})
      setIsUserIdValid(false);
      return;
    }

    setErrors({userIdTooShort: null})
    
    const result = await fetch(SERVER_URL + 'api/RegisterUser/isUser/' + userId);
    const isAlreadyPresent = await result.json();
    
    console.log('user is already present ' + isAlreadyPresent);
    if(isAlreadyPresent){
      setErrors({userAlreadyPresent: "User " + userId + " is already present"})
      setIsUserIdValid(false);
      return;
    }

    setIsUserIdValid(true);
  }

  const handleEmailChange = async(event) => {
    let email = event.target.value;
    setEmail(email);  
    setErrors({invalidEmail: null});
    console.log("checking email");
    
    if(!email){
      email = '';
      setIsEmailValid(false);
      return;
    }

    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if(email.length < 4){
      setErrors({invalidEmail: "Invalid email"})
      setIsEmailValid(false);
      return;
    }

    if (!pattern.test(email)) {
      setErrors({invalidEmail: "Invalid email"})
      setIsEmailValid(false);
      return;
    }
    
    
    console.log("checking user response");
    let url = SERVER_URL + 'api/RegisterUser/getUserFromEmailUserIDCombination/' + email + "/" + (!userId ? '!' : userId);
    console.log("url" + url);
    let result;
    try{
      result = await fetch(url);    
    }
    catch(error){
      setErrors({invalidEmail: "unfortunately, there seems to be a problem with the server at the moment. Please try again later"})
      setIsEmailValid(false);
      return;
    }
    const checkUserResponse = await result.json();

    if(!checkUserResponse)
    {
      setErrors({invalidEmail: "unfortunately, there seems to be a problem with the server at the moment. Please try again later"})
      setIsEmailValid(false);
      return;
    }

    if(checkUserResponse["emailAlreadyPresent"])
    {
      setErrors({invalidEmail: "There is already an email " + email + " registered with us"});
      setIsEmailValid(false);
      return;
    }

    if(checkUserResponse["userIDAlreadyPresent"])
    {
      setErrors({invalidEmail: "There is already a user " + userId + " registered with us"});
      setIsUserIdValid(false);
      return;
    }

    console.log(checkUserResponse);

    setErrors({invalidEmail: null})
    setIsEmailValid(true);
  }

  const handleConfirmPasswordChange = async(event) => {
    let confirmPassword = event.target.value;
    setConfirmPassword(confirmPassword);
    setErrors({confirmPasswordDoesnotMatch: null});

    if(confirmPassword.length < 7){
      setConfirmPasswordValid(false);
      return;
    }

    if(!doPasswordsMatch(password, confirmPassword)){
      setConfirmPasswordValid(false);
      setErrors({confirmPasswordDoesnotMatch: 'passwords do not match'});
      return;
    }

    setConfirmPasswordValid(true);
    setErrors({confirmPasswordDoesnotMatch: null});
  }
  
  const doPasswordsMatch = (password, confirmPassword) => {
    console.log(password, confirmPassword);

    if(password === confirmPassword){
      setErrors({confirmPasswordDonotmatch: null});
      return true;
    }

    setErrors('Passwords do not match');
    return false;
  }

  const handlePasswordChange = async(event) => {
    let password = event.target.value;
    setPassword(password);
    setErrors({passwordTooShort: null})
    
    if(!password){
      password = '';
      setPasswordValid(false);
      return;
    }

    if(password.length < 7){
      setErrors({passwordTooShort: 'Password is too short'})
      setPasswordValid(false);
      return;
    }

    setPasswordValid(true);
    setConfirmPasswordValid(doPasswordsMatch(password, confirmPassword));
  }

  const renderUserIdlLabel = () => {
    if(!userId){
      return <div class="left"><label><b>User ID</b></label></div>;
    }
    
    if (!isUserIdValid) {
      return <div class="left"><label style={{color: "red"}}><b>User ID</b></label></div>;
    } else {
      return <div class="left"><label><b>User ID</b></label></div>;
    }
  }

  const renderEmailLabel = () => {
    if (!isEmailValid) {
      return <div class="left"><label style={{color: "red"}}><b>Email</b></label></div>;
    } else {
      return <div class="left"><label><b>Email</b></label></div>;
    }
  }

  const renderPasswordLabel = () => {
    if (!isPasswordValid) {
      return <div class="left"><label style={{color: "red"}}><b>Password</b></label></div>;
    } else {
      return <div class="left"><label><b>Password</b></label></div>;
    }
  }

  const renderRegistrationConfirmation = () => {
    if (isConfirmationRedirect) {
      return <Navigate to="/registerConfirmation" />;
    }
  }

  const renderConfirmPasswordLabel = () => {
    if (!isConfirmPasswordValid) {
      return <div class="left"><label style={{color: "red"}}><b>Confirm Password</b></label></div>;
    } else {
      return <div class="left"><label><b>Confirm Password</b></label></div>;
    }
  }

  const isFormValidated = () => {
    return (isFirstNameValid && isLastNameValid && isUserIdValid && isEmailValid) && isTelephoneValid && isPasswordValid && isConfirmPasswordValid && !submitting;
  }

  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [isTelephoneValid, setTelephoneValid] = useState(true);
  const [errors, setErrors] = useState({});
  const [isUserIdValid, setIsUserIdValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setPasswordValid] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordValid, setConfirmPasswordValid] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isFirstNameValid, setFirstNameValid] = useState(false);
  const [lastName, setLastName] = useState('');
  const [isLastNameValid, setLastNameValid] = useState(true);
  const [isConfirmationRedirect, setconfirmationRedirect] = useState(false);

  function changeTelephone(phone, isValid) {
    setTelephone(phone);
    setTelephoneValid(isValid);
  }

  function changeFirstName(name, isValid) {
    setFirstName(name);
    setFirstNameValid(isValid);
  }

  function changeLastName(name, isValid) {
    setLastName(name);
    setLastNameValid(isValid);
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({ErrorsubmittingTheForm: null})
    let path = '';

    if (typeof window !== 'undefined') {
      path = window.location.origin.toString();
    }

    const source = SHUL === 'MD' ? "mountaindaleshul" : "shul";
    const data = JSON.stringify({ password: password, userID: userId, email: email, source: source, firstName: firstName, lastName: lastName, telephone: telephone, baseUrl: path + '/activateAccount'});
    console.log(data);

    //console.log(SERVER_URL + 'api/RegisterUser/');
    fetch(SERVER_URL + 'api/RegisterUser/', {  method: 'PUT',  body: data, headers: {
      'Content-Type': 'application/json',
    }}).then(helperUtil.handleErrors)
    .then(function(response) {      
        console.log(response);
        setSubmitting(false);
        return response.json();
      }).then(function(data) {
        console.log(data);
        if(!data.status || !data.confirmationEmailSent)
        {
          setErrors({errorsubmittingTheForm: 'There was an error during the form submission'});
          return;
        }

        console.log('Confirmation redirect');
        setconfirmationRedirect(true);
    }).catch(function(error) {
        console.log(error);
        setErrors({errorsubmittingTheForm: 'There was an error during the form submission'});
        setSubmitting(false);        
    });;
  }

    return (
      <div className="wrapper">
      <br></br>
      
      <View>
      <form>
        <table >
          <tbody>
          <tr>
              <td>
              <h1>Register</h1>
              <hr></hr>
              </td>
            </tr>
            <firstNameEntry.FirstNameInput onFirstNameChange={changeFirstName} name={firstName} controlsStyle="table"/>
            <lastNameEntry.LastNameInput onLastNameChange={changeLastName} name={lastName}/>
            <tr>
              <td>
                {renderUserIdlLabel()}
              </td>
            </tr>
            <tr>
              <td>
                  <div class="left">
                  <input name="userID" 
                  placeholder="Enter User ID (optional)" 
                  onChange={handleUserIDChange} value={userId || ''} disabled={submitting}/>
                  </div>
                  <div className="gap-10"></div>
                  <span style={{color: "red"}}>{errors["userAlreadyPresent"]}</span>
                  <span style={{color: "red"}}>{errors["userIdTooShort"]}</span>                  
              </td>
            </tr>
            <tr>
              <td>
                {renderEmailLabel()}
              </td>
            </tr>
            <tr>
              <td>
                  <div class="left">
                  <input name="email" required
                  placeholder="Enter email (required)" 
                  onChange={handleEmailChange} value={email || ''} disabled={submitting}/>
                  </div>
                  <div className="gap-10"></div>
                  <span style={{color: "red"}}>{errors["invalidEmail"]}</span>                  
              </td>
            </tr>
            
            <telephoneEntry.TelephoneInput onTelephoneChange={changeTelephone} telephone={telephone} controlsStyle="table"/>
            <tr>
              <td>
                {renderPasswordLabel()}
              </td>
            </tr>
            <tr>
              <td>
                <div class="left">
                <input type="password" placeholder="Enter password (required)" 
                name="password" 
                onChange={handlePasswordChange} value={password || ''} disabled={submitting}
                required />
                </div>
                <div className="gap-20"></div> 
                <span style={{color: "red"}}>{errors["passwordTooShort"]}</span>
              </td>
            </tr>
            <tr>
              <td>
                {renderConfirmPasswordLabel()}
              </td>
            </tr>
            <tr>
              <td>
                <div class="left">
                <input type="password" placeholder="Confirm password (required)" 
                name="confirmPassword" 
                onChange={handleConfirmPasswordChange} value={confirmPassword || ''} disabled={submitting}
                required />
                </div>
                <div className="gap-20"></div> 
                <span style={{color: "red"}}>{errors["confirmPasswordDoesnotMatch"]}</span>
              </td>
            </tr>
            <tr>
            <td>
              <span style={{color: "red"}}>{errors["errorsubmittingTheForm"]}</span>
              </td>
            </tr>
            <tr>
              <td>
              <div class="left">
              <Button onClick={handleSubmit} disabled = {!isFormValidated()}>Submit</Button>
              </div>
              {renderRegistrationConfirmation()}              
              </td>
            </tr>
          </tbody>
        </table>        
      </form>
      </View>
    </div>
    )
  }

export default Register
