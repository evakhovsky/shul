import React, { useState } from 'react';
import utilService from '../shared/services/utilservice'
import { Navigate } from "react-router-dom";
import authenticationService from '../shared/services/authentication.service'
import './Account.css';
import telephoneEntry from '../shared/TelephoneEntry'
import Button from 'react-bootstrap/Button';
import firstNameEntry from '../shared/FirstNameEntry'
import lastNameEntry from '../shared/LastNameEntry'
import { View } from 'react-native';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import MessageBoxDialog from '../shared/controls/MessageBoxDialog'

function Account() {
    const [initialFirstName, setInitialFirstName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [isFirstNameValid, setFirstNameValid] = useState(false);
    const [lastName, setLastName] = useState('');
    const [isLastNameValid, setLastNameValid] = useState(true);
    const [telephone, setTelephone] = useState('');
    const [isTelephoneValid, setTelephoneValid] = useState(true);
    const [address, setAddress] = useState('initial');
    const [jewishName, setJewishName] = useState('');
    const [isJewishNameValid, setJewishNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [isUpdateError, setUpdateError] = useState(false);
    const [isShowMessageBox, setShowMessageBox] = useState(false);

    React.useEffect(() => {
        async function fetchData() {
                const lclAccount = await utilService.getAccount();

                if(!lclAccount || !lclAccount.firstName){
                    setFirstNameValid(false);
                }

                console.log(lclAccount);
                setInitialFirstName(lclAccount.firstName);
                setFirstName(lclAccount.firstName);
                setLastName(lclAccount.lastName);
                setTelephone(lclAccount.telephone);
                setEmail(lclAccount.email);
                setAddress(lclAccount.address);
                setUserId(lclAccount.id);
                setJewishName(lclAccount.jewishName);
                if(lclAccount.firstName && lclAccount.firstName.length > 0){
                setFirstNameValid(true);
            }
        }
        fetchData();
        
    }, []);

    function changeFirstName(name, isValid) {
        setFirstName(name);
        setFirstNameValid(isValid);
        setUpdateError(false);
    }

    function changeLastName(name, isValid) {
        setLastName(name);
        setLastNameValid(isValid);
        setUpdateError(false);
    }

    function changeJewishName(name, isValid) {
        setJewishName(name);
        setJewishNameValid(isValid);
        setUpdateError(false);
    }

    function changeTelephone(phone, isValid) {
        setTelephone(phone);
        setTelephoneValid(isValid);
        setUpdateError(false);
    }

    const submitChanges = async () => {
        setUpdateError(false);
        console.log(address)
        const result = await utilService.modifyProfile(firstName,
            lastName,
            telephone,
            address.label,
            jewishName,
            userId,
            email);

        if(!result){
            setUpdateError(true);
            return;
        }

        setShowMessageBox(true);
    }

    const renderUpdateError = () => {
        if(isUpdateError){
            return <div class="left"><h3 style={{color: "red"}}><b>There was an error during submission</b></h3></div>;
        }
    }

    const handleMessageBoxOk = () => {
        console.log('OKed!');
        // Perform the action, e.g., delete an item
        setShowMessageBox(false);
    };

    const handleSubmit = event => {
        setUpdateError(false);
        event.preventDefault();

        submitChanges();
    }

    const isFormValidated = () => {
        return (isTelephoneValid && isFirstNameValid && isLastNameValid && isJewishNameValid);
    }

    const renderAccount = () => {    
        if(!authenticationService.isUserLoggedIn()){
            return <Navigate to="" />;
    }

    const renderPlacesAutoComplete = () => {
        if(address === 'initial'){
            return;
        }
        
        console.log(address);
        
        return(
        <GooglePlacesAutocomplete
            apiKey={"AIzaSyBxYdTbUh_Soo8vkiJQ6QhFlZ7kMH5aq5g"}
            selectProps={{
            defaultInputValue: address, // This sets the initial value
            onChange: setAddress, // This updates the state when a place is selected
            placeholder: "Enter an address",
            // ... other selectProps
        }}
      // ... other props for GooglePlacesAutocomplete
    />);
        
    }

    const renderMessageBox = address => {
        return(
            <MessageBoxDialog
                show={isShowMessageBox}
                onOk={handleMessageBoxOk}
                message="Submitted"
            />
        );
    }

        return <div>
            <div className="smallLeftOffset">
                <h4>
                    Your Profile <span style={{color: "blue"}}>{initialFirstName}</span>
                </h4>
            </div>
            <form>
            <table >
                <tbody>
                <firstNameEntry.FirstNameInput onFirstNameChange={changeFirstName} name={firstName} controlsStyle="table"/>                    
                <div>
                <lastNameEntry.LastNameInput onLastNameChange={changeLastName} name={lastName}/>
                </div>
                <div>
                    <tr>
                    <td align="right">
                        <div><label>Email</label></div>
                    </td>
                    </tr>
                    <tr>
                    <td><label>{email}</label></td>
                    </tr>
                </div>
                <telephoneEntry.TelephoneInput onTelephoneChange={changeTelephone} telephone={telephone} controlsStyle="table"/>
                <div>
                    <tr>
                    <td align="right">
                        <div><label><b>Address</b></label></div>
                    </td>
                    </tr>
                </div>
                </tbody>
                </table >
                
            <div className="smallLeftOffset">
            {renderPlacesAutoComplete()}
            <div className="gap-10"></div>
            </div>            
                <table>
                    <tbody>
                    <div>
                        <lastNameEntry.LastNameInput onLastNameChange={changeJewishName} name={jewishName} labelText="Jewish Name - שם יהודי" applyRegularExpression={false}/>
                    </div>
                    <tr>
                        <td>
                            {renderUpdateError()}
                        </td>
                    </tr>
                    <tr>
                    <td>
                        <div class="left">
                            <Button onClick={handleSubmit} disabled = {!isFormValidated()}>Update</Button>
                        </div>                        
                    </td>
                </tr>
                    </tbody>
                </table>

                <div>
            </div>          
        </form>
        {renderMessageBox()}
        </div>   
    }

    return (
        <div>
            {renderAccount()}
        </div>
    )
}

export default Account