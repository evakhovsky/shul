import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { createBrowserHistory } from "history";
import './Register.css';
import './Login.css';
import authenticationService from '../shared/services/authentication.service'
import { Navigate } from "react-router-dom";

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin : false,
            userId : '',
            password : '',
            isUserIDValid: false,
            isPasswordValid: false,
            hasErrors: false,
            renderUserDonations: false
        }        
        window.helloComponent = this;
        this.handleSubmit = this.handleSubmit.bind(this);
        console.log('calling LoginComponent constructor');
    }

    openModal() {
        console.log("calling open modal");
        this.setState({
            showLogin : true,
            password: ''
        });
    }

    isRegisterRoute() {
        let history = createBrowserHistory();
        let currentRoute = history.location.pathname;
        return currentRoute === '/register';
    }

    closeModal() {
        this.setState({
            showLogin : false
        });
    }

    isFormValidated = () => {
        return (this.state.isUserIDValid && this.state.isPasswordValid);
    }

    renderRegisterLink = () => {
        if (!this.isRegisterRoute()) {
          return <Link to="/register" onClick={() => {window.location.href="/register"}}>Register</Link>;
        }
      }

    renderUserIdLabel = () => {
        if (!this.state.isUserIDValid) {
            return <div class="left"><label style={{color: "red"}}><b>User Id:</b></label></div>;
          } 
          return <div class="left"><label><b>User Id:</b></label></div>;
      }

    renderPasswordLabel = () => {
        if (!this.state.isPasswordValid) {
            return <div class="left"><label style={{color: "red"}}><b>Password:</b></label></div>;
        } 
        return <div class="left"><label><b>Password:</b></label></div>;
      }

    handleUserIdChange =(event) => {
        let userId = event.target.value;
        this.setState({
            userId : userId
        });
        if (!!!(userId) || userId.length < 4){
            this.setState({
                isUserIDValid : false
            });
            return;
        }
        this.setState({
            isUserIDValid : true
        });
    }

    handlePasswordChange = (event) => {
        let password = event.target.value;
        this.setState({
            password : password
        });
        if (!!!(password) || password.length < 7){
            this.setState({
                isPasswordValid : false
            });
            return;
        }
        this.setState({
            isPasswordValid : true
        });
    }

    renderUserDonations = () => {
        if (!this.state.renderUserDonations) {
          return;
        }
        
        if(window.location.pathname === '/'){
            return;
        }

        return <Navigate to={{
          pathname: '/'
        }} />;
    }

    handleSubmit = async(event) => {
        event.preventDefault();

        await authenticationService.login(this.state.userId, this.state.password);
        var token = localStorage.getItem('token');
        if(token) {
            this.closeModal();
            if(this.props.tokenHandler){
                this.props.tokenHandler(token);
            }

            this.setState({
                renderUserDonations: true
            });
            return;
        }

        this.setState({
            hasErrors : true 
        });
    }

    renderError = () => {
        let error = this.state.hasErrors;
        if(error)
            return <div class="left"><label style={{color: "red"}}><b>Authentication error</b></label></div>;
    }
    
    render() {
        return (
            <section>
                <Modal show={this.state.showLogin} onHide={this.closeModal.bind(this)}>
                <Modal.Header closeButton>
                <Modal.Title>Please enter your user name and password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        {this.renderUserIdLabel()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input name="userId" 
                                        placeholder="Enter user id (required)" 
                                        onChange={this.handleUserIdChange} value={this.state.userId || ''}/>
                                        <div className="gap-10"></div>  
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {this.renderPasswordLabel()}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input name="password" type="password"
                                        placeholder="Enter password (required)" 
                                        onChange={this.handlePasswordChange} value={this.state.password || ''}/>
                                        <div className="gap-10"></div>                                          
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    <Link to="/forgotCredentials" onClick={() => {window.location.href="/forgotCredentials"}}>Forgot user name or password</Link>
                                    </td>
                                {this.renderError()}
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                {this.renderRegisterLink()}
                <Button variant="secondary" onClick={this.handleSubmit.bind(this)} disabled = {!this.isFormValidated()}>
                    Submit                    
                </Button>                
                </Modal.Footer>
            </Modal>
            {this.renderUserDonations()}
            </section>
        );
    }
}
export default LoginComponent;