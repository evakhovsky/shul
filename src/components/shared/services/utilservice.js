import helperUtil from 'util'
import authenticationService from './authentication.service'
import dateFnsFormat from 'date-fns/format';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

export const utilService = {
    markPage,
    getAccount,
    modifyProfile,
    getDateFormatted,
    getAddress,
    isJsonString,
    isEmailPatternValid,
    getVariableForEntity,
    getDonatePhysicalAddress
};

async function markPage(title, description) {
    let url = 'api/ConfigVariable/updateHomePageCounter/Generic/CounterMD/IndexPage';
    if(SHUL === 'OS'){
        url = 'api/ConfigVariable/UpdateHomePageCounter';
    }

    await fetch(SERVER_URL + url)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).catch(function(error) {
        console.log(error);
    });
}

async function getVariableForEntity(configName, prop1) {
    let url = 'api/ConfigVariable/getVariableByCombination/' + configName + '/' + prop1 + '/' + SHUL;
    console.log('about to call ' + SERVER_URL + url);
    let configVar = null;

    await fetch(SERVER_URL + url)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        if(data !== null && data.configVar !== null){
            configVar = data.configVar.valueStr;
        }
        console.log(data);
    }).catch(function(error) {
        console.log(error);
    });

    return configVar;
}

async function getAccount() {
    const id = authenticationService.getUserID();
    let accountInfo = {};

    await fetch(SERVER_URL + 'api/SourceContact/getContactByID/' + id)
    .then(helperUtil.handleErrors)
    .then(function(response){        
        return response.json();
    }).then(function(data) {
        accountInfo = data;
        console.log(data);
    }).catch(function(error) {
        console.log(error);
    });

    return accountInfo;
}

async function modifyProfile(firstName, 
                             lastName,
                             telephone,
                             address,
                             jewishName,
                             id,
                             email){
    const data = JSON.stringify({ 
        id: id,
        firstName: firstName, 
        lastName: lastName, 
        telephone: telephone, 
        email: email, 
        address: address,
        jewishName: jewishName});
        
        let result = false;

        await fetch(SERVER_URL + 'api/SourceContact/ModifySourceContact', {  method: 'POST',  body: data, headers: {
            'Content-Type': 'application/json',
          }}).then(helperUtil.handleErrors)
          .then(function(response) {      
              console.log(response);
              return response.json();
            }).then(function(data) {
              console.log(data);
              if(data.status){
                result = true;  
              }          
          }).catch(function(error) {
              console.log(error);
              result = false;
          });
    
          return result;
}

function getDateFormatted(date) {
    if(!date){
        return '';
    }
    var lclDate = new Date(date);
    const format = 'MM-dd-yyyy';
    return dateFnsFormat(lclDate, format);
}

async function getAddress() {
    console.log('about to call getAddress ' + SERVER_URL + 'api/ConfigVariable/getVariableByCombination/Generic/Address/' + SHUL);
    let address;

    await fetch(SERVER_URL + 'api/ConfigVariable/getVariableByCombination/Generic/Address/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return '';
            }

            console.log(data);
            console.log(data.configVar.valueStr);
            address = data.configVar.valueStr;
        })
        .catch(function (error) {
            console.log(error);
        });

    return address;
}

async function getDonatePhysicalAddress(){
    console.log('about to call getAddress ' + SERVER_URL + 'api/ConfigVariable/getVariableByCombination/Generic/DonatePhysicalAddress/' + SHUL);
    let address;

    await fetch(SERVER_URL + 'api/ConfigVariable/getVariableByCombination/Generic/DonatePhysicalAddress/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return '';
            }

            console.log(data);
            console.log(data.configVar.valueStr);
            address = data.configVar.valueStr;
        })
        .catch(function (error) {
            console.log(error);
        });

    return address;
}

function isEmailPatternValid(emailValue){
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if(!emailValue || emailValue === undefined || emailValue === null || emailValue.length < 4){
        return false;
    }

    if (!pattern.test(emailValue)) {
        return false;
    }

    return true;  
}

function isJsonString(str){
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export default utilService;