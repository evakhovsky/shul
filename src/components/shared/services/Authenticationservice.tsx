import { jwtDecode } from 'jwt-decode';
import { IAuthenticationService, IUserLogin, IToken } from './IAuthenticationservice';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

class AuthenticationService implements IAuthenticationService {
  async login(username: string, password: string ): Promise<IUserLogin>{
    localStorage.removeItem('token');
    const data = JSON.stringify({ password: password, userID: username, source: SHUL});
    const response = 
    await fetch(SERVER_URL + 'api/UserLogin/', {  method: 'PUT',  body: data, headers: {
            'Content-Type': 'application/json',
          }})
          .then(function(response) {      
              console.log(response);              
              return response.json();
            }).then(function(data) {
              console.log(data);
              if(!data.status || !data.token)
              {                
                return data;
              }
    
            const user = jwtDecode(data.token); // decode your token here
            console.log('user');
            console.log(user);

            localStorage.setItem('token', data.token);

            return data;
          }).catch(function(error) {
              console.log(error);
          });

    return response;
  }

    public isUserLoggedIn = () : boolean  => {
        var token = localStorage.getItem('token');
    
        if (!token) {
            return false;
        }

        return !this.isExpired();
    }

    private isExpired = () : boolean  => {
        var token = localStorage.getItem('token');
        if (!token) {
            return true;
        }

        let resultToken : IToken = jwtDecode<IToken>(token);
        
        if (!resultToken.exp) {
            console.log("something is wrong with the token");
            return true;
        }

        console.log(resultToken.FirstName);        
        return Date.now() > resultToken.exp  * 1000;
    }

    public getUserFirstName = () : string => {
        var token = localStorage.getItem('token');
        if (!token) {
            return '';
        }

        let resultToken : IToken = jwtDecode<IToken>(token);

        if (!resultToken.FirstName) {
            console.log("something is wrong with the token");
            return '';
        }

        return resultToken.FirstName;
    }    

    public logout = () : void => {
        localStorage.removeItem('token');
    }

    public async resetPassword(email: string) : Promise<string>{
      console.log('sending reset password request');
      const path = window.location.origin.toString();
      const data = JSON.stringify({ email: email, userName: '', baseUrl: path + '/passwordReset', source: SHUL});
      let result = ' ';

      await fetch(SERVER_URL + 'api/RegisterUser/RequestPasswordReset', {  method: 'POST',  body: data, headers: {
        'Content-Type': 'application/json',
      }}).then(function(response) {      
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

    public async resetCredentials(email: string, token: string, password: string) : Promise<string>{
      const data = JSON.stringify({ email: email, token: token, password: password});
      let result = ' ';
      console.log('sending password reset');
      console.log(data);

      await fetch(SERVER_URL + 'api/RegisterUser/PasswordReset', {  method: 'POST',  body: data, headers: {
          'Content-Type': 'application/json',
        }})
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

}

export const authenticationService = new AuthenticationService();