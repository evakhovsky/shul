import React, { useState } from 'react';
import utilService from '../shared/services/utilservice'
import { Navigate } from "react-router-dom";
import authenticationService from '../shared/services/authentication.service'
import './Account.css';
import telephoneEntry from '../shared/TelephoneEntry'
import Button from '@mui/material/Button';
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
    const [jewishName, setJewishName] = useState('');
    const [isJewishNameValid, setJewishNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [isUpdateError, setUpdateError] = useState(false);
    const [isShowMessageBox, setShowMessageBox] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

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
                setUserId(lclAccount.id);
                setJewishName(lclAccount.jewishName);
                if(lclAccount.firstName && lclAccount.firstName.length > 0){
                setFirstNameValid(true);
                setSelectedPlace({ label: lclAccount.address, value: lclAccount.address });
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
        console.log(selectedPlace)
        const result = await utilService.modifyProfile(firstName,
            lastName,
            telephone,
            selectedPlace.label,
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
        return(
            <View style={{ flex: 0.5, marginLeft: 8, zIndex: 1000 }}>
                <label><b>Address</b></label>
                <GooglePlacesAutocomplete
                    apiKey={"AIzaSyBxYdTbUh_Soo8vkiJQ6QhFlZ7kMH5aq5g"}
                    selectProps={{
                    onChange: setSelectedPlace, // This updates the state when a place is selected
                    placeholder: "Enter an address",
                    value: selectedPlace
                    // ... other selectProps
                }}
                // ... other props for GooglePlacesAutocomplete
                />
            </View>
        );        
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
            <View style={{ flex: 0.5, marginLeft: 10 }}>
                <View style={{ marginBottom: 25 }}>
                    <h4>Your Profile <span style={{color: "blue"}}>{initialFirstName}</span></h4>
                </View>                
                <firstNameEntry.FirstNameInput onFirstNameChange={changeFirstName} name={firstName} controlsStyle="table"/>                    
                <lastNameEntry.LastNameInput onLastNameChange={changeLastName} name={lastName}/>
                <label>Email</label>
                <td><label>{email}</label></td>
                <View style={{ marginTop: 20 }}>
                    <telephoneEntry.TelephoneInput onTelephoneChange={changeTelephone} telephone={telephone} controlsStyle="table"/>
                </View>
                {renderPlacesAutoComplete()}
                <View style={{ marginTop: 20 }}>
                    <lastNameEntry.LastNameInput onLastNameChange={changeJewishName} name={jewishName} labelText="Jewish Name - שם יהודי" applyRegularExpression={false}/>
                </View>
            </View>
            <form>                        
                {renderUpdateError()}                
                <Button variant="contained" 
                        style={{ marginLeft: 20, marginTop: 15 }}
                        onClick={handleSubmit} 
                        sx={{ display: 'inline-block' }}
                        disabled = {!isFormValidated()}>Update</Button>
                
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