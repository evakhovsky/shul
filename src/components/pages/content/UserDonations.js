import React, { useState } from 'react';
import authenticationService from '../../shared/services/authentication.service'
import { Navigate } from "react-router-dom";
//import 'react-day-picker/lib/style.css';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import "react-day-picker/dist/style.css";
import '../Home.css';
import dateFnsFormat from 'date-fns/format';
import Button from 'react-bootstrap/Button';
import donationService from '../../shared/services/donationService'
import Table from 'react-bootstrap/Table'
import {TableRow, TableBody, TableHead, TableCell} from '@mui/material';
import { Text, View } from 'react-native';
import {Link } from "react-router-dom";

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

    const renderDonation = (donation, index) => {
        return (
            <TableRow key={index}>
              <TableCell align="left" style={{ textAlign: 'left', width: "20%" }}>${donation.amount}</TableCell>
              <TableCell align="left" style={{ textAlign: 'left', width: "20%" }}>{formatReturnedDate(donation.date)}</TableCell>
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

    return (
            <View style={{flex: 1, justifyContent: "center", alignItems: 'center'}}>                
                {renderHeader()}
                {renderDateRange()}                
                {renderFilterButton()}                
                {renderTable()}                                    
            </View>
        );
    }

    return (
        <div className="center">             
        {renderWelcomeHeader()}
        </div>
    );
}

export default UserDonations;