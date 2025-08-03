import helperUtil from 'util'
import { jwtDecode } from 'jwt-decode';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

export const authenticationService = {
    login,
    isExpired,
    logout,
    isUserLoggedIn,
    getUserFirstName,
    resetPassword,
    resetCredentials,
    getUserEmail,
    sendContactUs,
    getUserRoles,
    isAdministrator,
    getAllRoles,
    addRole,
    deleteRole,
    getUsersInRole,
    getUserID,
    isSuperUser
};

async function login(username, password) {
    localStorage.removeItem('token');
    const data = JSON.stringify({ password: password, userID: username, source: SHUL});
    await fetch(SERVER_URL + 'api/UserLogin/', {  method: 'PUT',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(helperUtil.handleErrors)
      .then(function(response) {      
          console.log(response);              
          return response.json();
        }).then(function(data) {
          console.log(data);
          if(!data.status || !data.token)
          {                
            return;
          }

        const user = jwtDecode(data.token); // decode your token here
        console.log(user);
        localStorage.setItem('token', data.token);
      }).catch(function(error) {
          console.log(error);
      });
}

function getUserFirstName()  {
    var token = localStorage.getItem('token');
    
    if (!token) {        
        return null;
    }

    const user = jwtDecode(token);
    console.log('getUserFirstName we have a token. token.FirstName ' + user.FirstName)
    return user.FirstName;
};

function getUserEmail()  {
    var token = localStorage.getItem('token');
    
    if (!token) {        
        return null;
    }

    const user = jwtDecode(token);
    console.log('getUserFirstName we have a token. token.Email ' + user.Email)
    return user.Email;
};

function getUserID()  {
    var token = localStorage.getItem('token');
    
    if (!token) {        
        return null;
    }

    const user = jwtDecode(token);
    console.log('getUserID we have a token. token.UserID ' + user.ContactID)
    return user.ContactID;
};

function getUserRoles()  {
    var token = localStorage.getItem('token');
    
    if (!token) {        
        return null;
    }

    const user = jwtDecode(token);
    console.log('user roles ' + user.Roles)
    return user.Roles;
};

function isSuperUser(){
    var token = localStorage.getItem('token');
    
    if (!token) {        
        return false;
    }

    const user = jwtDecode(token);
    if(!user.Roles)
    {
        return false;
    }

    return user.Roles.includes('SuperUser');
}

function isAdministrator(){
    var token = localStorage.getItem('token');
    
    if (!token) {        
        return false;
    }

    const user = jwtDecode(token);
    if(!user.Roles)
    {
        return false;
    }

    return user.Roles.includes('Administrator');
}

function isUserLoggedIn()  {
    var token = localStorage.getItem('token');
    
    if (!token) {
        return false;
    }

    return !isExpired();
};

function isExpired()  {
    var token = localStorage.getItem('token');
    if (!token) {
        return true;
    }

    const user = jwtDecode(token);

    if (!user.exp) {
        console.log("something is wrong with the token");
        return true;
    }

    return Date.now() > token.exp;
};

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
}

async function resetPassword(email){
    console.log('sending reset password request');
    const path = window.location.origin.toString();
    const data = JSON.stringify({ email: email, userName: '', baseUrl: path + '/passwordReset', source: SHUL});
    let result = ' ';

    await fetch(SERVER_URL + 'api/RegisterUser/RequestPasswordReset', {  method: 'POST',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(helperUtil.handleErrors)
      .then(function(response) {      
          console.log(response);
          return response.json();
        }).then(function(data) {
          console.log(data);          
          if(!data.emailAlreadyPresent || !data.emailExistsInContacts || !data.userIDAlreadyPresent){
                result = 'Email was not found';
            }
      }).catch(function(error) {
          console.log(error);
          result = 'There was an error during submission';
      });

      return result;
}

async function resetCredentials(email, token, password){
    const data = JSON.stringify({ email: email, token: token, password: password});
    let result = ' ';
    console.log('sending password reset');
    console.log(data);

    await fetch(SERVER_URL + 'api/RegisterUser/PasswordReset', {  method: 'POST',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(helperUtil.handleErrors)
      .then(function(response) {      
          console.log(response);
          return response.json();
        }).then(function(data) {
          console.log(data);
          if(data.generalStatus){
              
          }
          if(data.errors){
            result = data.errors;
          }

          if(!data.generalStatus){
            result = 'There was an error during submission';    
          }
      }).catch(function(error) {
          console.log(error);
          result = 'There was an error during submission';
      });

      return result;
}

async function sendContactUs(email, firstName, subject){
    const data = JSON.stringify({ firstName: firstName, lastName: firstName, email: email, subject: subject, source: SHUL});
    let result = ' ';

    await fetch(SERVER_URL + 'api/Contacts/ContactUs', {  method: 'POST',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(helperUtil.handleErrors)
      .then(function(response) {      
          console.log(response);
          return response.json();
        }).then(function(data) {
          console.log(data);
          if(!data.status){
            result = 'There was an error during submission';  
          }          
      }).catch(function(error) {
          console.log(error);
          result = 'There was an error during submission';
      });

      return result;
}

async function getAllRoles() {
    let roles = {};

    await fetch(SERVER_URL + 'api/RoleManagement/getAllRoles/')
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        roles = data;
        //console.log(data);
    }).catch(function(error) {
        console.log(error);
    });

    return roles;
}

async function addRole(role) {
    const data = JSON.stringify({ role: role, id: null});
    let result = false;
    console.log('sending add role');
    console.log(data);

    await fetch(SERVER_URL + 'api/UserProfile/AddRole', {  method: 'POST',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(helperUtil.handleErrors)
      .then(function(response) {      
          console.log(response);
          return response.json();
        }).then(function(data) {
          console.log(data);
          result = data;
      }).catch(function(error) {
          console.log(error);
          result = false;
      });

      return result;
}

async function deleteRole(id) {
    const data = JSON.stringify({ role: null, id: id});
    let result = false;
    console.log('sending delete role');
    console.log(data);

    await fetch(SERVER_URL + 'api/UserProfile/DeleteRole', {  method: 'POST',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(helperUtil.handleErrors)
      .then(function(response) {      
          console.log(response);
          return response.json();
        }).then(function(data) {
          console.log(data);
          result = data;
      }).catch(function(error) {
          console.log(error);
          result = false;
      });

      return result;
}

async function getUsersInRole(roleId) {
    let roles = {};

    await fetch(SERVER_URL + 'api/RoleManagement/getUsersForRole/' + roleId)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        roles = data;
        //console.log(data);
    }).catch(function(error) {
        console.log(error);
    });

    return roles;
}
export default authenticationService;