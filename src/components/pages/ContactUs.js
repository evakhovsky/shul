import React from 'react'
import authenticationService from '../shared/services/authentication.service'
import Textarea from 'react-expanding-textarea'
import './ContactUs.css';
import Button from 'react-bootstrap/Button'
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Text } from 'react-native';

class ContactUsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserLoggedIn : false,
            email : '',
            error : '',
            isEmailValid : false,
            subject : '',
            isSubjectValid : false,
            firstName : '',
            isFirstNameValid : false,
            contactUsSuccess : false,
            isBeingSubmitted : false
        };
                
    }

    renderContactUsSuccess = () => {
        if (this.state.contactUsSuccess) {
            return (<Navigate
          to={{
            pathname: "/contactUsSuccess"
          }}/>);                  
        }        
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        
        this.setState({isBeingSubmitted : true});
        let result = await authenticationService.sendContactUs(this.state.email, this.state.firstName, this.state.subject);
        if(!result || result.length < 2) {
            console.log('Successfully submitted');
            this.setState({contactUsSuccess : true});
            this.setState({isBeingSubmitted : false});
            return;
        }

        this.setState({isBeingSubmitted : false});
        console.log('Bad submission');
        this.setState({error : result});
    }

    componentDidMount() {
        this.setUserLoggedIn();
        console.log('calling componentDidMount');
    }

    setUserLoggedIn() {        
        let isUserLoggedIn = authenticationService.isUserLoggedIn();
        if(isUserLoggedIn === this.state.isUserLoggedIn){
            return;
        }

        this.setState({isUserLoggedIn : isUserLoggedIn});
        if(isUserLoggedIn){
            let email = authenticationService.getUserEmail();
            let firstName = authenticationService.getUserFirstName();
            this.setState({email : email, firstName: firstName, isEmailValid : true, isFirstNameValid : true});
        }
    }

    renderError = () => {
        let error = this.state.error;
        if(error)
            return <div class="left"><label style={{color: "red"}}><b>{error}</b></label></div>;
    }

    handleEmailChange = async(event) => {
        let email = event.target.value;
        this.setState({email : email});
        this.setState({error : null});
        
        if(!email){
            this.setState({email : email, isEmailValid : false});
          return;
        }
    
        if(email.length < 4){
            this.setState({error : "Invalid email", isEmailValid : false});
            return;
        }

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        
        if (!pattern.test(email)) {
            this.setState({error : "Invalid email", isEmailValid : false});
            return;
        }
        
        this.setState({email : email, isEmailValid : true});
    }

    handleFirstChange = async(event) => {
        let firstName = event.target.value;
        this.setState({firstName : firstName});
        this.setState({error : null});
        
        if(!firstName){
            this.setState({firstName : firstName, isFirstNameValid : false});
          return;
        }
    
        if(firstName.length < 1){
            this.setState({isFirstNameValid : false});
            return;
        }

        this.setState({firstName : firstName, isFirstNameValid : true});
    }

    handleSubjectChange = async(event) => {
        let subject = event.target.value;
        this.setState({subject : subject});
        this.setState({error : null});
    
        if(!subject){
            this.setState({isSubjectValid : false});
          return;
        }
    
        if(subject.length < 4){
            this.setState({isSubjectValid : false});
            return;
        }

        this.setState({isSubjectValid : true});        
    }

    renderEmailLabel = () => {
        if(!this.state.isEmailValid){
            console.log('invalid email');
            return (
            <div class="left"><label><b>Your Email<span style={{color: "red"}}> *</span></b></label></div>
            );
        }

        return (
        <div class="left"><label><b>Your Email</b></label></div>
        );
    }

    renderSubjectLabel = () => {
        if(!this.state.isSubjectValid){
            return (
            <div class="left"><label align="left"><b>Subject<span style={{color: "red"}}> *</span></b></label></div>
            );
        }

        return (
        <div class="left"><label><b>Subject</b></label></div>
        );
    }

    renderTextArea = () => {
        return (
            <Textarea
                    className="textarea"
                    id="my-textarea"
                    align="left"
                    maxLength="3000"
                    name="subject"
                    onChange={this.handleSubjectChange}
                    value={this.state.subject || ''}
                    placeholder="Enter subject (required)" />
        );
    }

    renderUserEmail = () => {
        if(this.state.isUserLoggedIn){
            return (
            <div class="left"><label>Hello <b>{authenticationService.getUserFirstName()}</b>. How can we help you?</label></div>
            );
        }

        return (
            <div class="left">
                {this.renderEmailLabel()}
                <div class="left">
                <input name="email" 
                       placeholder="Enter email (required)" 
                       onChange={this.handleEmailChange} value={this.state.email || ''}/>
                </div>
            </div>
        );
    }

    renderFirstNameLabel = () => {
        if(this.state.isUserLoggedIn){
            return;
        }

        if(!this.state.isFirstNameValid){
            return (
            <div class="left"><label><b>Your Name<span style={{color: "red"}}> *</span></b></label></div>
            );
        }

        return (
        <div class="left"><label><b>Your Name</b></label></div>
        );
    }

    renderFirstName = () => {
        if(this.state.isUserLoggedIn){
            return;
        }

        return (
            <div class="left">
                {this.renderFirstNameLabel()}
                <div class="left">
                <input name="firstName" 
                       placeholder="Enter name (required)" 
                       onChange={this.handleFirstChange} value={this.state.firstName || ''}/>
                </div>
            </div>
        );
    }

    isFormValidated = () => {
        return (this.state.isEmailValid && this.state.isSubjectValid && this.state.isFirstNameValid);
    }

    isReadyToSubmit = () => {
        return (this.isFormValidated() && !this.state.isBeingSubmitted);
    }

    renderSubmitButton = () => {
        if(!this.state.isBeingSubmitted){
            return(
                <Button variant="secondary" onClick={this.handleSubmit.bind(this)} disabled = {!this.isReadyToSubmit()}>
                    Submit                    
                </Button>   
            )
        }

        return(
            <Text>
                <CircularProgress /> Submitting
            </Text>
        );
    }

    render() {
        return (
            <section>
                <div class="container">
                    <form>
                    {this.renderFirstName()}
                    {this.renderUserEmail()}
                    {this.renderSubjectLabel()}
                    {this.renderTextArea()}
                    {this.renderSubmitButton()}
                    </form>
                </div>
                {this.renderError()}
                {this.renderContactUsSuccess()}
            </section>
        );
    }
}
export default ContactUsComponent;