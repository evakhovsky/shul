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
    userDonations: '/userDonations'
  };

export class RouteConfig implements IRouteConfig {
    public isPublicRouter(path: string) : boolean{
        switch(path){
          case routesMap.userDonations:
          return false;

        }

        return true;
    }    
};

export const routeConfig = new RouteConfig();