import helperUtil from 'util'
import { jwtDecode } from 'jwt-decode';
import { IAuthenticationService, IUserLogin } from './IAuthenticationservice';

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
                return null;
              }
    
            const user = jwtDecode(data.token); // decode your token here
            console.log(user);
            localStorage.setItem('token', data.token);
            return data;
          }).catch(function(error) {
              console.log(error);
          });

    return response;
  }
}

export const authenticationService = new AuthenticationService();