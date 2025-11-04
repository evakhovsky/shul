export interface IRouteConfig {
  isPublicRouter(path: string) : boolean;
}

export const routesMap = { 
    home: "/home",
    login: "/login",
    register: "/register",
    registerConfirmation: "/registerConfirmation",
    forgotCredentials: '/forgotCredentials',
    passwordReset: '/passwordReset',
    passwordResetWasSent: '/passwordResetWasSent',
    paypal: "/paypal",
    payPalConfirm: "/payPalConfirm",
    payPalConfirmSubscription: "/payPalConfirmSubscription",
    userDonations: '/userDonations',
    account: "/account",
    contactUs: "/contactUs",
    contactUsSuccess: "/contactUsSuccess"
  };

export class RouteConfig implements IRouteConfig {
    public isPublicRouter(path: string) : boolean{
        switch(path){
          case routesMap.userDonations:
          case routesMap.account:
            return false;

        }

        return true;
    }    
};

export const routeConfig = new RouteConfig();