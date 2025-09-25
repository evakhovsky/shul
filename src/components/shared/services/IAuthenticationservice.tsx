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

export interface IAuthenticationService {
  login(username: string, password: string ): Promise<IUserLogin>;
}

