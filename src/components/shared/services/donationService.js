import helperUtil from 'util'
import authenticationService from './authentication.service'
import dateFnsFormat from 'date-fns/format';
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

export const donationService = {
    getDonations,
    getPayPalTransations,
    getPayPalBalances,
    getDonationsUnauthenticated
};

function formatDate(date) {
    const format = 'MM-dd-yyyy';
    return dateFnsFormat(date, format);
}

async function getDonations(startDate, endDate) {
    let clientId = authenticationService.getUserID();
    startDate = formatDate(startDate);
    endDate = formatDate(endDate);
    let donations = undefined;
    await fetch(SERVER_URL + 'api/ContactDonations/getDonations/' + clientId + '/' + startDate + "/" + endDate + "/" + SHUL)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        console.log(data);
        donations = data;
    })
    .catch(function(error) {
        console.log(error);
    });

    return donations;
}

async function getPayPalBalances() {
    console.log('getPayPalBalances');

    let clientId = authenticationService.getUserID();
    
    const formData = new FormData();
    formData.append("userId", clientId);
    formData.append("entity", SHUL);

    try {
        const res = await axios.post(SERVER_URL + 'api/PayPalAdmin/GetBalances', formData);
        if(res.data){
            console.log('ok response');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function getPayPalTransations(startDate, endDate) {
    console.log('getPayPalTransations');
    
    let clientId = authenticationService.getUserID();
    startDate = formatDate(startDate);
    endDate = formatDate(endDate);
    
    const formData = new FormData();
    formData.append("userId", clientId);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("entity", SHUL);
    
    try {
        const res = await axios.post(SERVER_URL + 'api/PayPalAdmin/GetTransactions', formData);
        if(res.data){
            console.log('ok response');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function getDonationsUnauthenticated(token, shul, startDate, endDate){
    let donations = undefined;
    if(shul !== SHUL){
        console.log('shuls mismatch. got' + shul + ' instead of ' + SHUL);
        return null;
    }

    startDate = formatDate(startDate);
    endDate = formatDate(endDate);
    
    console.log(SERVER_URL + 'api/ContactDonations/getDonationsUnauthenticated/' + token + "/" + SHUL + "/" + startDate + "/" + endDate);

    await fetch(SERVER_URL + 'api/ContactDonations/getDonationsUnauthenticated/' + token + "/" + SHUL + "/" + startDate + "/" + endDate)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        console.log(data);
        donations = data;
    })
    .catch(function(error) {
        console.log(error);
    });

    return donations;
}
export default donationService