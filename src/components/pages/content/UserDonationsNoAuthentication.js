import donationService from '../../shared/services/donationService';
import { useState } from 'react';
//import DayPickerInput from 'react-day-picker/DayPickerInput'
//import helperUtil from '../../shared/Util'
import dateFnsFormat from 'date-fns/format';
import Button from 'react-bootstrap/Button';
import {Link } from "react-router-dom";
import {Table, TableRow, TableCell, TableBody, TableHead} from '@mui/material';
import queryString from 'query-string';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Text, View } from 'react-native';
import dayjs from 'dayjs';

function UserDonationsNoAuthentication() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [firstName, setFirstName] = useState('');
    const [donations, setDonations] = useState('');
    const [serverError, setServerError] = useState(false);
    const [total, setTotal] = useState(0);
    const [token, setToken] = useState(0);
    const [shul, setShul] = useState(0);

    window.onload = function (){
        onPageLoad();      
    }

    const onPageLoad = async () => {
        const parsed = queryString.parse(window.location.search);

        //http://localhost:3000/userDonationsNoAuthentication?token=55d1d853-a9a7-46b9-97ed-ffe40a973001&shul=KM&firstName=Ezra
//{shul: 'KM', token: '12345'}
//http://localhost:3000/userDonationsNoAuthentication?token=f736473f-ab54-44f1-8192-a99acb3b2c41&shul=OS&firstName=Ezra

        if(!parsed || parsed === undefined || parsed === null){
            return;
        }

        console.log(parsed);

        if(!parsed.token || parsed.token === undefined || parsed.token === null){
            console.log('undefined token');
            return;
        }

        if(!parsed.shul || parsed.shul === undefined || parsed.shul === null){
            console.log('undefined shul');
            return;
        }

        if(!parsed.firstName || parsed.firstName === undefined || parsed.firstName === null){
            console.log('undefined firstName');
            return;
        }

        setFirstName(parsed.firstName);        

        populateInitialDate();
        setTotal(0);

        console.log('about to call getDonationsUnauthenticated');
        let beginDate = new Date((new Date()).getFullYear(), 0, 1);
        let donations = await donationService.getDonationsUnauthenticated(parsed.token, parsed.shul, beginDate, new Date());
        if(donations === null || donations === undefined){
            setServerError(true);
            return;
        }

        setDonations(donations);
        let total = donations.reduce((result,v) =>  result += v.amount , 0 );            
        setTotal(total);
        setToken(parsed.token);
        setShul(parsed.shul);
    }

    const populateInitialDate = () => {
        let initialDate = new Date((new Date()).getFullYear(), 0, 1);
        setStartDate(initialDate);
    }

    const renderStartDate = () => {
        if(!startDate){
            return;
        }

        return (
            <View style={{marginRight: '10px', borderWidth: 0, borderColor: 'blue'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker
                        label="Start Date"
                        value={dayjs(startDate)}
                        onChange={(newValue) => setStartDate(newValue.toDate())}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            </View>
        );        
    }

    const renderDateRange = () => {
        return(
            <View style={{flex: 1, flexDirection: 'row', 
                            justifyContent: "center", 
                            alignItems: 'center', 
                            marginTop: '10px', 
                            marginBottom: '20px'}}>
                {renderStartDate()}
                {renderEndtDate()}
            </View>
        );
    }

    const renderEndtDate = () => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                    label="End Date"
                    value={dayjs(endDate)}
                    onChange={(newValue) => setEndDate(newValue.toDate())}
                    />
                </DemoContainer>
            </LocalizationProvider>
        );  
    }

    /*const renderStartDate = () => {
        const FORMAT = 'MM/dd/yyyy';
        if(!startDate){
            return;
        }

        return <DayPickerInput
        formatDate={helperUtil.formatDate}
        parseDate={helperUtil.parseDate}
        format={FORMAT}
        placeholder={dateFnsFormat(startDate, FORMAT)}
        dayPickerProps={{
            month: startDate,
            showWeekNumbers: true,
            todayButton: 'Today',
        }} 
        onDayChange={
            day => {
                if(moment.isDate(day)){
                    setStartDate(day)
                }          
            }
        } />;    
    }
    
    const renderEndDate = () => {
            const FORMAT = 'MM/dd/yyyy';
            return <DayPickerInput
            formatDate={helperUtil.formatDate}
            parseDate={helperUtil.parseDate}
            format={FORMAT}
            placeholder={dateFnsFormat(endDate, FORMAT)}
            dayPickerProps={{
                month: endDate,
                showWeekNumbers: true,
                todayButton: 'Today',
            }} 
            onDayChange={
                day => {
                    if(moment.isDate(day)){
                        setEndDate(day)
                    }
                    console.log(endDate)
                }
            } />;    
    }*/

    const renderStartEndDates = () => {
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>                
                {renderDateRange()}                
                {renderFilterButton()}                                            
            </View>
        );
    }

    const handleFilter = async event => {
        event.preventDefault();
        let donations = await donationService.getDonationsUnauthenticated(token, shul, startDate, endDate);
        if(donations === null || donations === undefined){
            setServerError(true);
            return;
        }

        setDonations(donations);
        let total = donations.reduce((result,v) =>  result += v.amount , 0 );            
        setTotal(total);
    }

    const renderFilterButton = () => {
        return (
            <Button variant="light" onClick={handleFilter}>Filter by date</Button>            
        );
    }

    const renderHeader = () => {
        if(!firstName || firstName.length === 0){
            return;
        }

        let lastCharacter = firstName.slice(-1);
        let header = firstName + (lastCharacter === 's' || lastCharacter === 'S' ? "'" : "'s");

        return (
            <div className="center">
                <h3>{header} recorded donations</h3><br></br>
            </div>);
    }

    const formatReturnedDate = (date) => {
        if(!date){
            return '';
        }
        var lclDate = new Date(date);
        const format = 'MM-dd-yyyy';
        return dateFnsFormat(lclDate, format);
    }

    const renderDonation = (donation, index) => {
        return (
            <TableRow key={index}>
              <TableCell align="left" style={{ textAlign: 'left', width: "20%" }}>${donation.amount}</TableCell>
              <TableCell align="left" style={{ textAlign: 'left', width: "25%" }}>{formatReturnedDate(donation.date)}</TableCell>
              <TableCell align="left" style={{ textAlign: 'left', width: "40%" }}>{donation.purpose}</TableCell>
              <TableCell align="left" style={{ textAlign: 'left', width: "20%" }}></TableCell>
            </TableRow>
          );
    }

    const renderTable = () => {
            if(serverError){
                return (
                    <div>
                        <span style={{color: "red"}}>There seems to be a problem on our end</span>
                        <p/>
                        <Text>Please <Link to="/contactUs">Contact Us</Link></Text>
                    </div>
                );
            }

            if(!donations){
                return;
            }
            
            if(!donations || donations === null || donations === undefined || donations.length === 0){
                return (
                    <div>
                        <p/>
                        <Text>We currently cannot locate any donations recorded to you within the given date range</Text>
                        <p/>
                        <Text>Please try to redefine the date range and try again</Text>
                        <p/>
                        <Text>If you still having trouble please <Link to="/contactUs">Contact Us</Link></Text>
                    </div>
                );
            }

            return (
                <div>
                    <p/>
                    <p/>
                    <Table striped hover size="sm">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{ width: "20%" }}>Amout</TableCell>
                                <TableCell align="left" style={{ width: "20%" }}>Date</TableCell>
                                <TableCell align="left" style={{ width: "40%" }}>Purpose</TableCell>
                                <TableCell align="left" style={{ width: "20%" }}>Total: ${total}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {donations.map(renderDonation)}
                        </TableBody>            
                    </Table>
                </div>
            );
        }

    return(
        <div>
            {renderHeader()}
            {renderStartEndDates()}
            <div className="flex-container85 center">
                {renderTable()}    
            </div> 
        </div>
    );
}

export default UserDonationsNoAuthentication;