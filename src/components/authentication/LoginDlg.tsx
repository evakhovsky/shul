import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { authenticationService } from '../shared/services/Authenticationservice';
import { IUserLogin } from '../shared/services/IAuthenticationservice';
import { View } from 'react-native';

export interface LoginDlgProps {
  open: boolean;
  onClose: () => void;  
}

export default function LoginDlg(props: LoginDlgProps) {
  const {open, onClose} = props;
  const [isUserIDValid, setIsUserIDValid] = React.useState(false);
  const [isPasswordValid, setPasswordValid] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [hasErrors, setHasErrors] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [specificError, setSpecificError] = React.useState('');
  
  useEffect(() => {
    if (open) {
      console.log('Dialog is now open!');
      setUserId('');
      setPassword('');
      setIsUserIDValid(false);
      setPasswordValid(false);
    } 
  }, [open]); // Depend on the isOpen state

  const onSubmit = async() => {
    setIsSubmitting(true);

    let result: IUserLogin;

    result  = await authenticationService.login(userId, password);
    console.log(result);

    if(!result || result === null){
      console.log('null result from login');
      return;
    }

     if(result && result !== undefined && result !== null){
      console.log(result.firstName);
    }

    var token = localStorage.getItem('token');
    if(token) {
        onClose();
        setIsSubmitting(false);
        return;
    }

    if(result.userExists && !result.correctPassword){
      setSpecificError('User exists, but password is wrong');
    }

    if(result.userExists && result.correctPassword && !result.isEmailConfirmed){
      setSpecificError('The email has not been confirmed');
    }

    setIsSubmitting(false);
    setHasErrors(true);    
  }

  const renderUserIdLabel = () => {
    if (!isUserIDValid) {
            return <InputLabel style={{color: "red", paddingLeft: "15px"}}><b>User Id:</b></InputLabel>;
          } 
          return <InputLabel style={{paddingLeft: "15px"}}>User Id:</InputLabel>;
  }

  const renderPasswordLabel = () => {
    if (!isPasswordValid) {
        return <InputLabel style={{color: "red", paddingLeft: "15px", marginTop: "10px"}}><b>Password:</b>          
        </InputLabel>;
    }

    return <InputLabel style={{paddingLeft: "15px", marginTop: "10px"}}>Password:</InputLabel>;
  }

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let userId = event.target.value;
        setUserId(event.target.value); // Update the state with the new value
        if (!!!(userId) || userId.length < 4){
            setIsUserIDValid(false);
            return;
        }
        
        setIsUserIDValid(true);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let password = event.target.value;
        setPassword(event.target.value); // Update the state with the new value
        if (!!!(password) || password.length < 7){
            setPasswordValid(false);
            return;
        }
        
        setPasswordValid(true);
  };

  const renderUserIdInput = () => {
    return <TextField 
            id="userid-input" 
            style={{paddingLeft: "15px", paddingRight: "15px"}}
            placeholder="Enter user id (required)"
            onChange={handleUserIdChange}/>;
  }

  const renderPasswordInput = () => {
    return <TextField 
            id="password-input" 
            style={{paddingLeft: "15px", paddingRight: "15px"}}
            placeholder="Enter password (required)"
            onChange={handlePasswordChange}
            type="password"/>
  }

  const isSubmitValid = (): boolean => {
    return (isUserIDValid && isPasswordValid && !isSubmitting);
  }

  const renderError = () => {
    if(hasErrors){
        let specificErrorText : string = '';
        if(specificError.length > 0){
          specificErrorText = ' (' + specificError + ')';
        }
        return <div><label style={{color: "red", marginTop: "20px", marginLeft: "15px"}}><b>Authentication error{specificErrorText}</b></label></div>;
    }
  }

  return (
    <Dialog open={open} 
            onClose={onClose}
            fullWidth={true}
            maxWidth="sm">
      <DialogTitle>Please enter your user name and password
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
        {renderUserIdLabel()}
        {renderUserIdInput()}
        {renderPasswordLabel()}
        {renderPasswordInput()}
        {renderError()}
        <View style={{ flex: 0.5, justifyContent: "flex-end", alignItems: 'flex-end' }}>
          <Button variant="contained" onClick={onSubmit} disabled = {!isSubmitValid()}>
            {isSubmitting ? "Submitting..." : "Sign in"}
          </Button>
        </View>
    </Dialog>
  );
}