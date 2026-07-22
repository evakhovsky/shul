import { IPagePostAd, IPostMainPageAdmin } from "./IPostMainPageAdmin";

const SHUL = process.env.REACT_APP_SHUL;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

class PostMainPageAdmin implements IPostMainPageAdmin {
    public async saveEditorData(editorData: string) : Promise<boolean>{
        const uniqueId: string = crypto.randomUUID();

        const userData: IPagePostAd = {
            ID: uniqueId,
            Description: editorData,
            IsHTML: false,
            StartDate: new Date().toISOString(),
            EndDate: new Date().toISOString(),
            ContactID: "",
            Entity: SHUL || "",
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