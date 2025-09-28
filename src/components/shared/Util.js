import useViewport from '../shared/ViewportProvider'
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
 import { isDate } from 'date-fns';

export const helperUtil = {
    handleErrors,
    getDayOfTheWeek,
    getWeekRange,
    IsMobile,
    getWeekRangeFormatted,
    getDateFormatted,
    parseDate,
    formatDate
};

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function getDayOfTheWeek(date) {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Erev Shabbos','Shabbos'];
    
    return days[ date.getDay() ];
}

function getWeekRange(date) {
    let endDate = new Date(date.getTime());
    for(var i = 0; i < 7; i++){
        if(endDate.getDay() === 6){
            break;
        }            
        endDate.setDate(endDate.getDate() + 1);
    }

    let startDate = new Date(date.getTime());
    for(i = 0; i < 7; i++){
        if(startDate.getDay() === 0){
            break;
        }            
        startDate.setDate(startDate.getDate() - 1);
    }

    console.log(startDate)
    console.log(endDate)
    return [startDate, endDate];
}

function getWeekRangeFormatted(date, htmlFormat) {
    let range = getWeekRange(date);
    const FORMAT = htmlFormat ? 'MM-dd-yyyy' : 'MM/dd/yyyy';
    let startDay = dateFnsFormat(range[0], FORMAT);
    let endDay = dateFnsFormat(range[1], FORMAT);
    return [startDay, endDay];
}

function IsMobile() {
    const { width } = useViewport();
    const breakpoint = 620;
  
    return width < breakpoint;
}

function getDateFormatted(date, htmlFormat) {
    const FORMAT = htmlFormat ? 'MM-dd-yyyy' : 'MM/dd/yyyy';
    return dateFnsFormat(date, FORMAT);
}

function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (isDate(parsed)) {
      return parsed;
    }
    return undefined;
}

function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
}
export default helperUtil

