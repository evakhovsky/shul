import helperUtil from 'util'

const LONGITUDE = process.env.REACT_APP_LONGITUDE;
const LATITUDE = process.env.REACT_APP_LATITUDE;
const TZID = process.env.REACT_APP_TZID;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const ZIP = process.env.REACT_APP_ZIP;
const SHUL = process.env.REACT_APP_SHUL;

export const hebcalAPIservice = {
    getDateTimes,
    getDateZmanim,
    getWeeklySchedule,
    getAstronomicalTimes
};

async function getWeeklySchedule(date) {
    console.log('about to call getDateTimes ' + SERVER_URL + 'api/ShulSchedule/getWeeklySchedule/' + SHUL + '/' + date);
    let scheduleEvents = {};

    await fetch(SERVER_URL + 'api/ShulSchedule/getWeeklySchedule/' + SHUL + '/' + date)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        console.log(data);
        if(data.isObjectQualityGood)
        {
            scheduleEvents = data;
        }
    })
    .catch(function(error) {
        console.log(error);
    });

    return scheduleEvents;
}

async function getDateTimes(date, format) {
    console.log('about to call getDateTimes ' + SERVER_URL + 'api/JewishTimes/getJDateInfo/' + date + '/' + format + '/' + LONGITUDE + '/' + LATITUDE + '/' + TZID);
    let dayFormattedString = '';

    //await fetch(SERVER_URL + 'api/JewishTimes/getJDateInfo/' + '09-11-2021' + '/' + format)
    await fetch(SERVER_URL + 'api/JewishTimes/getJDateInfo/' + date + '/' + format + '/' + LONGITUDE + '/' + LATITUDE + '/' + TZID)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        //console.log(data);
        if(data.isObjectQualityGood)
        {
            dayFormattedString = data.jBasicDateInfo;
        }
    })
    .catch(function(error) {
        console.log(error);
    });

    return dayFormattedString;
}

async function getDateZmanim(date) {
    //console.log('about to call getJDateZmanim ' + SERVER_URL + 'api/JewishTimes/getJDateZmanim/' + date + '/' + ZIP);
    let zmanim = null;

    await fetch(SERVER_URL + 'api/JewishTimes/getJDateZmanim/' + date + '/' + ZIP)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        //console.log(data);
        if(data.isObjectQualityGood)
        {
            zmanim = data;
        }
    })
    .catch(function(error) {
        console.log(error);
    });

    return zmanim;
}

async function getAstronomicalTimes(date){
    console.log('about to call getAstronomicalTimes ' + SERVER_URL + 'api/ShulSchedule/getScientificSunTimes/' +  LONGITUDE + '/' + LATITUDE + '/' + date);
    let astronomicalTimes = {};

    await fetch(SERVER_URL + 'api/JewishTimes/getScientificSunTimes/' +  LONGITUDE + '/' + LATITUDE + '/' + date)
    .then(helperUtil.handleErrors)
    .then(function(response){
        return response.json();
    }).then(function(data) {
        //console.log(data);
        astronomicalTimes = data;
    })
    .catch(function(error) {
        console.log(error);
    });

    return astronomicalTimes;
}

export default hebcalAPIservice