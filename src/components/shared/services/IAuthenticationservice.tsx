export interface IUserLogin {
    status: boolean;
    token: string;
    isEmailConfirmed: boolean;
    isContactEmail: boolean;
    userExists: boolean;
    correctPassword: boolean;
    firstName: string;
    contactId: string;
}

export interface IToken {
    ContactID : string;
    Email : string;
    FirstName : string;
    Roles : string;
    UserID : string;
    exp : number;
    iat : number;
    nbf : number;
    role : string;
}

export interface IAuthenticationService {
    login(username: string, password: string ): Promise<IUserLogin>;
    isUserLoggedIn() : boolean;
    getUserFirstName() : string;
    logout() : void;
}

