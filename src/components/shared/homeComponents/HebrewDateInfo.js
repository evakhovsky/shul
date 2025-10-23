import React, { useState, useCallback } from 'react';
import dateFnsFormat from 'date-fns/format';
import hebcalAPIservice from '../services/hebcalAPIservice'
import { Text, View } from 'react-native';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import '../../pages/Home.css';
import Table from 'react-bootstrap/Table'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ZmanimDialog from './ZmanimDialog'
import useViewport from '../ViewportProvider'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import TextField from "@mui/material/TextField";

export const hebrewDayInfo = {
    HebrewDayInfo
};

export function HebrewDayInfo({format}) {
    const [gregorianDate, setGregorianDate] = useState(new Date());
    const [dayString, setDayString] = useState('');
    const [zmanimString, setZmanimString] = useState('');
    const [showZmanimDlg, setShowZmanimDlg] = useState(false);
    const [language, setLanguage] = useState('English');
    const [key, setKey] = useState(0); // Initial key for rerender
    const [zmanimTS, setZmanimTS] = useState({});
    const [astronomicalTimesTS, setAstronomicalTimesTS] = useState({});
    
    const populateZmanim = useCallback(async (date) => {
        let zmanim = await hebcalAPIservice.getDateZmanim(formatDayDate(date));
        if(!zmanim){
            return;
        }

        //console.log(zmanim);
        unpackZmanimforTypeScript(zmanim);
    }, [])

    const unpackZmanimforTypeScript = (zmanim) => {
            const zmanimData = {
                chatzotNight: zmanim.chatzotNight,
                chatzotNightTime: zmanim.chatzotNightTime,
                alotHaShachar: zmanim.alotHaShachar,
                alotHaShacharTime: zmanim.alotHaShacharTime,
                misheyakir: zmanim.misheyakir,
                misheyakirTime: zmanim.misheyakirTime,
                misheyakirMachmir: zmanim.misheyakirMachmir,
                misheyakirMachmirTime: zmanim.misheyakirMachmirTime,
                dawn: zmanim.dawn,
                dawnTime: zmanim.dawnTime,
                sunrise: zmanim.sunrise,
                sunriseTime: zmanim.sunriseTime,
                sofZmanShma: zmanim.sofZmanShma,
                sofZmanShmaTime: zmanim.sofZmanShmaTime,
                sofZmanTfilla: zmanim.sofZmanTfilla,
                sofZmanTfillaTime: zmanim.sofZmanTfillaTime,
                chatzot: zmanim.chatzot,
                chatzotTime: zmanim.chatzotTime,
                minchaGedola: zmanim.minchaGedola,
                minchaGedolaTime: zmanim.minchaGedolaTime,
                minchaKetana: zmanim.minchaKetana,
                minchaKetanaTime: zmanim.minchaKetanaTime,
                plagHaMincha: zmanim.plagHaMincha,
                plagHaMinchaTime: zmanim.plagHaMinchaTime,
                sunset: zmanim.sunset,
                sunsetTime: zmanim.sunsetTime,
                tzeit42min: zmanim.tzeit42min,
                tzeit42minTime: zmanim.tzeit42minTime,
                tzeit50min: zmanim.tzeit50min,
                tzeit50minTime: zmanim.tzeit50minTime,
                tzeit72min: zmanim.tzeit72min,
                tzeit72minTime: zmanim.tzeit72minTime,
                chatzotNightEng: zmanim.chatzotNightEng,
                alotHaShacharEng: zmanim.alotHaShacharEng,
                misheyakirEng: zmanim.misheyakirEng,
                misheyakirMachmirEng: zmanim.misheyakirMachmirEng,
                dawnEng: zmanim.dawnEng,
                sunriseEng: zmanim.sunriseEng,
                sofZmanShmaEng: zmanim.sofZmanShmaEng,
                sofZmanTfillaEng: zmanim.sofZmanTfillaEng,
                chatzotEng: zmanim.chatzotEng,
                minchaGedolaEng: zmanim.minchaGedolaEng,
                minchaKetanaEng: zmanim.minchaKetanaEng,
                plagHaMinchaEng: zmanim.plagHaMinchaEng,
                sunsetEng: zmanim.sunsetEng,
                tzeit42minEng: zmanim.tzeit42minEng,
                tzeit50minEng: zmanim.tzeit50minEng,
                tzeit72minEng: zmanim.tzeit72minEng
            };

            setZmanimTS(zmanimData);
    }

    const unpackAstronomicalTimesforTypeScript = (times) => {
        const timesData = {
            sunrise:times.results.sunrise,
            sunset:times.results.sunset,
            dawn:times.results.dawn,
            dusk:times.results.dusk,
            first_light:times.results.first_light,
            last_light:times.results.last_light,
            solar_noon:times.results.solar_noon,
            day_length:times.results.day_length
        }

        setAstronomicalTimesTS(timesData);
    }

    const populateAstronomicalTimes = useCallback(async (date) => {
        let astronomicalTimes = await hebcalAPIservice.getAstronomicalTimes(formatDayDate(date));
        if(!astronomicalTimes){
            return;
        }

        unpackAstronomicalTimesforTypeScript(astronomicalTimes);
    }, [])

    React.useEffect(() => {
        async function fetchData() {
            console.log('fetching calendar daa ' + format)
            let dayFormatted = await hebcalAPIservice.getDateTimes(formatDayDate(new Date()), format);
            setDayString(dayFormatted);
            await populateZmanim(new Date());
            await populateAstronomicalTimes(new Date());
        }
        fetchData();
        
    }, [format, populateZmanim, populateAstronomicalTimes]);

    function IsMobile(){
        const { width } = useViewport();
        const breakpoint = 620;
      
        return width < breakpoint;
    }

    const formatDayDate = (date) => {
        if(!date){
            return '';
        }
        var lclDate = new Date(date);
        const format = 'MM-dd-yyyy';
        return dateFnsFormat(lclDate, format);
    }

    const handleDateChange = async (date) => {
        setZmanimString('');
        let dayFormatted = await hebcalAPIservice.getDateTimes(formatDayDate(date), format);            
        setDayString(dayFormatted);
        setGregorianDate(date);
        populateZmanim(date);
        populateAstronomicalTimes(date);
    };

    const handleAddDay = async () => {
        let currentDate = gregorianDate; 
        setZmanimString('');
        currentDate.setDate(currentDate.getDate() + 1);
        await populateOnDateChange(currentDate);
        setGregorianDate(currentDate);
        forceDatePickerRerender();
    };

    const handleSubtractDay = async () => {
        let currentDate = gregorianDate; 
        setZmanimString('');
        currentDate.setDate(currentDate.getDate() - 1);
        await populateOnDateChange(currentDate);
        setGregorianDate(currentDate);
        forceDatePickerRerender();
    };

    const populateOnDateChange = async (date) => {
        let dayFormatted = await hebcalAPIservice.getDateTimes(formatDayDate(date), format);            
        setDayString(dayFormatted);
        setGregorianDate(date);
        populateZmanim(date);
        populateAstronomicalTimes(date);
    }

    const handleMarqueeClick = async () => {
        setShowZmanimDlg(true);    
    }

    const forceDatePickerRerender = () => {
        setKey(prevKey => prevKey + 1); // Update the key to force re-render
    }

    const renderGregorianDate = () => {
        return <LocalizationProvider dateAdapter={AdapterDateFns}>

        <DatePicker
          key={key} // Assign the key
          value={gregorianDate}
          format="MM/dd/yyyy EEEE"
          onChange={handleDateChange}
          renderInput={(props) => <TextField {...props} />}
         />
        
      </LocalizationProvider>
    }

    const renderZmanim = () => {
        if(zmanimString === undefined || zmanimString === null || zmanimString.length < 2){
            return;
        }

        return <div>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center" }}>
                <Text>Tap the date for detailed zmanin, arrows to move between days.</Text>
            </View>            
        </div>
    }

    const renderZmanimDlg = () => {
        /*return <ZmanimDlg showModal={showZmanimDlg} 
                          onClose={onZmanimDlgClose} 
                          zmanim={zmanim} 
                          currentDate={gregorianDate} 
                          onSwitchLanguage={onSwitchLanguage} 
                          language={language}
                          astronomicalTimes={astronomicalTimes}/>*/
        return <ZmanimDialog open={showZmanimDlg} 
                             onClose={onZmanimDlgClose}
                             zmanim={zmanimTS}
                             currentDate={gregorianDate}
                             onSwitchLanguage={onSwitchLanguage}
                             language={language}
                             astronomicalTimes={astronomicalTimesTS} />
    }

    const onSwitchLanguage = () => {
        if(language === 'English'){
            setLanguage('Hebrew');
            return;
        }

        setLanguage('English');
    }

    function onZmanimDlgClose() {
        console.log('calling on close');
        setShowZmanimDlg(false);        
    }

    const renderCurrentDayInfo = () => {
        if(IsMobile()){
            return   ( <Table className="flex-container85" border="0">
            <TableRow>
                <TableCell style={{width: '100%', borderBottom:"none", borderTop:"none"}} colSpan={3} align="center">
                    {renderGregorianDate()}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                    <button className="link-btn" onClick={()=>handleSubtractDay()}>
                        <ArrowBackIos/>                        
                    </button>
                </TableCell>
                <TableCell style={{width: '60%', background:"#F8F9F9"}}>
                <div className="centerText cursor" onClick={()=>handleMarqueeClick()}>
                    <Text><b>{dayString}</b></Text>
                </div>
                </TableCell>
                <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}}>
                    <button className="link-btn" onClick={()=>handleAddDay()}>
                        <ArrowForwardIos/>                        
                    </button>
                </TableCell>
            </TableRow>
        </Table>);    
        }

        return   <Table className="flex-container100" border="0">
                    <TableRow>
                        <TableCell style={{width: '100%', borderBottom:"none", borderTop:"none"}} colSpan={3} align="center">
                            {renderGregorianDate()}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                            <button className="link-btn" onClick={()=>handleSubtractDay()}>
                                <ArrowBackIos/>                        
                            </button>
                        </TableCell>
                        <TableCell style={{width: '60%', background:"#F8F9F9"}}>
                        <div className="centerText cursor" onClick={()=>handleMarqueeClick()}>
                            <Text><b>{dayString}</b></Text>
                        </div>
                        </TableCell>
                        <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}}>
                            <button className="link-btn" onClick={()=>handleAddDay()}>
                                <ArrowForwardIos/>                        
                            </button>
                        </TableCell>
                    </TableRow>
                </Table>                
    }
    
    return (
        <div>
            {renderZmanimDlg()}
            {renderCurrentDayInfo()}
            {renderZmanim()}
            <div className="gap-20"/>
        </div>
    );
}

export default hebrewDayInfo;