import { Dayjs } from "dayjs";
import { IPagePostAd, IPostMainPageAdminService } from "./IPostMainPageAdminService";
import { authenticationService } from './Authenticationservice';

const SHUL = process.env.REACT_APP_SHUL;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

class PostMainPageAdmin implements IPostMainPageAdminService {
    public async saveEditorData(editorData: string, 
                                startDate: Dayjs | null,
                                endDate: Dayjs | null) : Promise<boolean>{
        const uniqueId: string = crypto.randomUUID();

        if(startDate === null) {
            console.error('Start date is null. Cannot save editor data.');
            return Promise.reject(new Error('Start date is null.'));
        }

        const userData: IPagePostAd = {
            ID: uniqueId,
            Description: editorData,
            IsHTML: false,
            StartDate: startDate ? startDate.format('MM-DD-YYYY') : new Date().toISOString(),
            EndDate: endDate ? endDate.format('MM-DD-YYYY') : new Date().toISOString(),
            ContactID: "",
            Entity: SHUL || "",
            IsAuthenticated: true,
            UserEmail: authenticationService.getEmail() || "",
        };

        let url = SERVER_URL + 'api/PostPageAd/PostAd';
        const data = JSON.stringify(userData);

        console.log('Sending editor data to server:', data);

        const response = 
            await fetch(url, {  method: 'POST',  body: data, headers: {
                    'Content-Type': 'application/json',
                  }})
                  .then(function(response) {      
                      return response.json();
                    }).then(function(data) {
                      if(!data.status || !data.token)
                      {                
                        return data;
                      }
                    
                    return data;
                  }).catch(function(error) {
                      console.log(error);
                  });
        
        return Promise.resolve(response);
    }
}

export const postMainPageAdmin = new PostMainPageAdmin();