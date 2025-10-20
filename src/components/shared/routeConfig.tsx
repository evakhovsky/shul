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
    passwordResetWasSent: '/passwordResetWasSent'
  };

export class RouteConfig implements IRouteConfig {
    public isPublicRouter(path: string) : boolean{
        return true;
  }
};

export const routeConfig = new RouteConfig();