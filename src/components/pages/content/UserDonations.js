import React, { useState } from 'react';
import authenticationService from '../../shared/services/authentication.service'
import { Navigate } from "react-router-dom";
//import 'react-day-picker/lib/style.css';
//import DayPickerInput from 'react-day-picker/DayPickerInput'
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import "react-day-picker/dist/style.css";
import '../Home.css';
import moment from 'moment'
import dateFnsFormat from 'date-fns/format';
import Button from 'react-bootstrap/Button';
import donationService from '../../shared/services/donationService'
import Table from 'react-bootstrap/Table'
import {TableRow, TableBody, TableHead, TableCell} from '@mui/material';
import { Text } from 'react-native';
import {Link } from "react-router-dom";
import helperUtil from '../../shared/Util'

function UserDonations() {
    const [firstName, setFirstName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [donations, setDonations] = useState([]);
    const [total, setTotal] = useState(0);
    const [serverError, setServerError] = useState(false);

    React.useEffect(() => {
        const populateInitialDonations = async () => {
            let beginDate = new Date((new Date()).getFullYear(), 0, 1);
            let donations = await donationService.getDonations(beginDate, new Date());
            setServerError(false);
            if(donations === null || donations === undefined){
                setServerError(true);
                return;
            }
            setDonations(donations);
            let total = donations.reduce((result,v) =>  result += v.amount , 0 );            
            setTotal(total);
        }

        async function fetchData() {
            let firstName = authenticationService.getUserFirstName();
            setFirstName(firstName);
            populateInitialDate();
            await populateInitialDonations();
        }
        fetchData();
        
    }, []);

    const populateInitialDate = () => {
        let initialDate = new Date((new Date()).getFullYear(), 0, 1);
        setStartDate(initialDate);
    }

    const renderWelcomeHeader = () => {
        if(!authenticationService.isUserLoggedIn()){
            return <Navigate to="" />;
        }

    const handleFilter = async event => {
        event.preventDefault();
        let donations = await donationService.getDonations(startDate, endDate);
        setDonations(donations);        
        console.log(donations);
    }

    const renderFilterButton = () => {
        return (<Button variant="light" onClick={handleFilter}>Filter by date</Button>);
    }

    const renderHeader = () => {
        if(!firstName || firstName.length === 0){
            return;
        }

        let lastCharacter = firstName.slice(-1);
        let header = firstName + (lastCharacter === 's' || lastCharacter === 'S' ? "'" : "'s");

        return <h3>{header} recorded donations</h3>;
    }

    const formatReturnedDate = (date) => {
        if(!date){
            return '';
        }
        var lclDate = new Date(date);
        const format = 'MM-dd-yyyy';
        return dateFnsFormat(lclDate, format);
    }

    const renderStartDate = () => {
        const FORMAT = 'MM/dd/yyyy';
        if(!startDate){
            return;
        }

        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker 
                        label="Uncontrolled picker" 
                        defaultValue={dayjs('2022-04-17')} 
                    />
                    <DatePicker
                    label="Start Date"
                    value={dayjs(startDate)}
                    onChange={(newValue) => setStartDate(newValue.toDate())}
                    />
                </DemoContainer>
            </LocalizationProvider>
        );

        /*return <DayPickerInput
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
        } />;*/
    }

    const renderEndtDate = () => {
        const FORMAT = 'MM/dd/yyyy';
        /*return <DayPickerInput
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
        } />;*/
    }

    const renderDonation = (donation, index) => {
        return (
            <TableRow key={index}>
              <TableCell align="left" style={{ textAlign: 'left', width: "25%" }}>${donation.amount}</TableCell>
              <TableCell align="left" style={{ textAlign: 'left', width: "55%" }}>{formatReturnedDate(donation.date)}</TableCell>
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

        if(donations.length === 0){
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
                            <TableCell align="left" style={{ width: "25%" }}>Amout</TableCell>
                            <TableCell align="left" style={{ width: "55%" }}>Date</TableCell>
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

    return (
            <div>
                <div className="center">
                    {renderHeader()}    
                </div>                
                <div className="center">
                    <label>Start Date</label>
                    {renderStartDate()}
                </div>
                <div className="center">
                    <label>End Date</label>
                    {renderEndtDate()}
                </div>
                <div className="center">
                    {renderFilterButton()}                    
                </div>
                <div className="flex-container85 center">
                    {renderTable()}    
                </div>                
            </div>
        );
    }

    return (
        <div className="center">             
        {renderWelcomeHeader()}
        </div>
    );
}

export default UserDonations;