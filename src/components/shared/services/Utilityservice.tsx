import { IUtilityservice } from './IUtilityservice';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

class Utilityservice implements IUtilityservice {
  
    public async markPage(): Promise<void> {
        let url = 'api/ConfigVariable/updateHomePageCounter/Generic/CounterMD/IndexPage';
        if (SHUL === 'OS') {
            url = 'api/ConfigVariable/UpdateHomePageCounter';
        }

        console.log('marking page');
        console.log(SERVER_URL + url);
        
        try {
            const response = await fetch(SERVER_URL + url);
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            await response.json();
        } catch (error) {
            console.error("Failed to mark page:", error);
        }
    }
    
}

export const utilityService = new Utilityservice();