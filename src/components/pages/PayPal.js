import React, { useState, useMemo } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import './PayPal.css';
import CurrencyInput from 'react-currency-input-field';
import Dropdown from 'react-bootstrap/Dropdown';
import Select from 'react-select'
import useViewport from '../shared/ViewportProvider'
import {Table, TableRow, TableCell} from '@mui/material';
import { View, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import {Link } from "react-router-dom";
import utilService from '../shared/services/utilservice';
import { Navigate } from "react-router-dom";

const SHUL = process.env.REACT_APP_SHUL;

function PayPal() {
  const [donationValue, setDonationValue] = useState('');
  const [isDonationValueValid, setIsDonationValueValid] = useState(true);
  const [isFractionalSubscription, setFractionalSubscription] = useState(false);
  const [isDonationTooSmall, setIsDonationTooSmall] = useState(false);
  const [isDonationEmpty, setIsDonationEmpty] = useState(false);
  const [isPurposeValid, setPurposeValid] = useState(true);
  const [purpose, setPurpose] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isRecurringMonthly, setIsRecurringMonthly] = useState(true);
  const [isRecurringYearly, setIsRecurringYearly] = useState(false);
  const [purposes, setPurposes] = useState({});
  const [isOtherPurposeSelected, setOtherPurposeSelected] = useState(false);
  const [donatePhysicalAddress, setDonatePhysicalAddress] = useState(null);
  const [isOnPayPalApprove, setOnPayPalApprove] = useState(false);
  const [approvedOrderDetails, setApprovedOrderDetails] = useState({});
  const [isConfirmSubscription, setIsConfirmSubscription] = useState(false);
  const [subscriptionID, setSubscriptionID] = useState('');

  const defaultOptions = useMemo(() => {
    const options = [
      { value: 'general', label: 'Support the shul' },
      { value: 'membership', label: 'Membership' },
      { value: 'kiddush', label: 'Kiddush' },
      { value: 'misheberach', label: 'Misheberach' },
      { value: 'aliya', label: 'Aliya' },
      { value: 'highHolidaysPledge', label: 'High Holidays pledge' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'misheberachLeCholim', label: 'Misheberach leCholim' },
      { value: 'shalachManos', label: 'Mishloach Manos' },
      { value: 'maosChitim', label: 'Maos Chitim' },
      { value: 'highHolidaySeat', label: 'High Holidays Seating' },
      { value: 'supportWebSite', label: 'Support the Web Site' },
      { value: 'other', label: 'Other' }
    ]

    return options;
  }, []);

  React.useEffect(() => {
    utilService.markPage();
    
    async function fetchData() {
      try{
        let jsonObj= null;
        var lclOptions = await utilService.getVariableForEntity('PayPal', 'PurposeBox');
        if(lclOptions !== undefined && lclOptions !== null && lclOptions.length > 1){
          jsonObj = JSON.parse(lclOptions);

          setPurposes(jsonObj);
        }

        try{
        var donatePhysAddress = await utilService.getDonatePhysicalAddress();
        setDonatePhysicalAddress(donatePhysAddress);
        console.log(donatePhysAddress);
        } catch (ex) {
          console.log(ex);
          setDonatePhysicalAddress(null);
        }

        if(!jsonObj || jsonObj === null || jsonObj === undefined){
          setPurposes(defaultOptions);
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
        setPurposes(defaultOptions);
    }
    }
    fetchData();
}, [defaultOptions]);

  const checkPurpose = () => {
    setPurposeValid(purpose);
    return purpose;    
  }

  function IsMobile(){
    const { width } = useViewport();
    const breakpoint = 620;
  
    return width < breakpoint;
 }

  const checkDonationValue = () => {
    console.log('donationValue ' + donationValue);
    if(isNaN(donationValue) && (!donationValue || donationValue.trim() === "")){
      console.log('donationValue empty');
      return false;
    }

    const donation = Number(donationValue);
    if(donation > 0 && donation < 1){
      return false;
    }

    if(donation < 1){
      return false;
    }

    console.log('donationValue ' + donationValue);
    return true;
  }

  const handlePriceChange = async(value) => {
    setDonationValue(value);
    setFractionalSubscription(false);
    setIsDonationTooSmall(false);

    if(!value || value.trim() === ""){
      setIsDonationEmpty(true);
      setIsDonationValueValid(false);      
      return;
    }

    setIsDonationEmpty(false);
  }

  const handleOrderClicked = event => {
    refreshDonationTooSmall();
  }

  const refreshDonationTooSmall = () => {    
    console.log('setting refreshDonationTooSmall ' + donationValue)
    if(isNaN(donationValue)){
      if(!donationValue || donationValue.trim() === "") {
        console.log('setting empty')
        setIsDonationEmpty(true);
        return;
      }
    }
    else{
      if(donationValue < 1){
        setIsDonationEmpty(true);    
        return;
      }
    }

    setIsDonationEmpty(false);

    if(Number(donationValue) < 1){
      console.log('refreshDonationTooSmall true');
      setIsDonationTooSmall(true);
      return;
    }

    setIsDonationTooSmall(false);
  }

  const checkFractionalSubscription = () => {
    return !isDecimal(donationValue);
  }

  const renderFractionalSubscription = () => {
    if(isFractionalSubscription){
      return <div className="left"><label style={{color: "red"}}><b>Subscription cannot be fractional</b></label></div>;
    }
  }

  const styles = StyleSheet.create({
    leftRowView: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start"
    },
    centerViewBelow: {
      flex: 0.5,
      flexDirection: "row",
      justifyContent: "center"
    },
    centerViewTop: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center"
    },
    centerViewSmallDonation: {
      flex: 1,
      justifyContent: "center"
    }
});


  const renderDonationIsTooSmallLabel = () => {
      if(isDonationEmpty){
        return (
          <View style={styles.centerViewTop}>
            <label style={{color: "blue"}}><b>If you would like to donate, please enter a valid amount in the box above</b></label>
          </View>
        );
      }

      if(isDonationTooSmall){
        return (
          <View style={styles.centerViewSmallDonation}>
              <label style={{color: "red"}}><b>Unfortunately, your donation is too small to be accepted electronically</b></label>
              <Text style={{color: "blue", textAlign: 'center', marginBottom: '10px', color: "#B85A46"}}>This is due to PayPal high percentage fees charged for small transactions. Please enter an amount equal or larger than $6</Text>
          </View>
        );
      }

      return <div className="left"><label></label></div>;
  }

  const renderPurposeValidLabel = () => {
    if(!isPurposeValid){
      return (
        <View style={styles.centerViewTop}>
          <label style={{color: "red"}}><b>Please select a purpose of this donation</b></label>
        </View>
      );
    }

    return;
  }

  const handleCurrencyInputBlur = (event) => {
    console.log('Value on blur:', event.target.value);

    const donation = Number(donationValue);
    if(donation > 0 && donation < 6)
    {
      setIsDonationValueValid(false);
      setIsDonationTooSmall(true);
      return;
    }

    if(donation < 1)
    {
      setIsDonationValueValid(false);
      setIsDonationTooSmall(false);
      return;
    }

    setIsDonationValueValid(true);
    setIsDonationTooSmall(false);
  };

  const renderCurrencyInput = () => {
    var donation = donationValue;
    if(!donation){
      donation = '';
    }

    return (
      <View style={styles.centerViewTop}>
        <View style={styles.centerViewBelow}>
          <CurrencyInput
            id="input-example"
            name="input-name"
            placeholder="Amount"
            decimalsLimit={2}
            value={donation}
            prefix="$"
            onValueChange={handlePriceChange}
            onBlur={handleCurrencyInputBlur}/>
        </View>
      </View>
    );
  }

  const handleAmountSelection = async (amount) => {
    console.log('amount ' + amount);
    setDonationValue(amount);
    setIsDonationEmpty(false);
    setIsDonationTooSmall(false);
  }

  const handlePurposeChange = value => {
    
    if(!value || value.label === undefined || value.label === null || value.label.length < 2){
      setOtherPurposeSelected(false);
      return;
    }

    var isOtherPuspose = value.label === 'Other';
    setOtherPurposeSelected(isOtherPuspose);

    if(isOtherPuspose){
      setPurpose(null);
      setPurposeValid(true);
      return;
    }

    setPurpose(value.label);
    setPurposeValid(true);
  };

  const handleRecurrencyChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setIsRecurring(value);
  };

  const renderSuggestedDonations = () => {
    if(SHUL === 'OS'){
      return (
        <View style={{flex: 1, flexDirection: "row", justifyContent:"center",
          // Fixes the overlapping problem of the component
          zIndex: 1000}}>
          <SafeAreaView style={{flex: 0.5, 
            // Fixes the overlapping problem of the component
            zIndex: 1}}>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                      Suggested donations
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleAmountSelection(18)}>Chai: $18.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(26)}>Membership: $26.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(36)}>2 x Chai: $36.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(54)}>3 x Chai: $54.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(72)}>4 x Chai: $72</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(90)}>5 x Chai: $90</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(120)}>Ad Meah veEsrim: $120</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(150)}>Sponsor a kiddush $150</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(180)}>10 x Chai: $180</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(360)}>20 x Chai: $360</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  </SafeAreaView>
                </View>
            );
    }

    return (<View style={{flex: 1, flexDirection: "row", justifyContent:"center",
              // Fixes the overlapping problem of the component
              zIndex: 1000}}>
              <SafeAreaView style={{flex: 0.5, 
                // Fixes the overlapping problem of the component
                zIndex: 1}}>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                      Suggested donations
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleAmountSelection(18)}>$18.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(36)}>$36.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(72)}>$72.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(160)}>Sponsor a kiddush $160.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(180)}>$180.00</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleAmountSelection(360)}>$360.00</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>  
              </SafeAreaView>                            
            </View>);
  }

  const handleOtherPurposeChange = async(value) => {
    console.log("purpose " + value);
    setPurpose(value);

    if(!value || value === undefined || value === null || value.length < 1){
      setPurposeValid(false);
      return;
    }

    setPurposeValid(true);
}

  const renderOtherPurposeBox = () => {
    if(!isOtherPurposeSelected){
      return;
    }

    return (
      <View style={{flex: 1, flexDirection: "row", justifyContent:"center",
        // Fixes the overlapping problem of the component
        zIndex: 997}}>
        <View style={{flex: 0.5, 
          // Fixes the overlapping problem of the component
          zIndex: 0}}>
            <TextInput
              placeholder="Enter Purpose (required)"
              autoCorrect={false}
              style={{backgroundColor: 'white', borderColor: 'black'}}
              value={purpose}
              onChangeText={handleOtherPurposeChange}
            />
        </View>
      </View>
    );
  }

  const renderPurposes = () => {
    return (
        <View style={{flex: 1, flexDirection: "row", justifyContent:"center",
          // Fixes the overlapping problem of the component
          zIndex: 999}}>
          <View style={{flex: 0.5, 
            // Fixes the overlapping problem of the component
            zIndex: 0}}>
              <Select options={purposes}
                onChange={handlePurposeChange}
                placeholder="Purpose (required)"
                />
          </View>
        </View>
    );
  }

  const renderPhysicalAddress = () => {
    if(!donatePhysicalAddress || donatePhysicalAddress === null || donatePhysicalAddress === undefined || donatePhysicalAddress.length ===0){
      return;
    }

    return (<View style={{flex: 1, flexDirection: "row", justifyContent:"center", marginTop: 20}}>
      <div className="content" dangerouslySetInnerHTML={{ __html: donatePhysicalAddress }}></div>
      </View>
    );
  }

  const handleSubscriptionSuccess = (data) => {
    setIsConfirmSubscription(true);
    setSubscriptionID(data.subscriptionID);
  }

  const renderPayPalButtons = () => {
    if(!isRecurring){
      return (
      <View style={{ flex: 1, justifyContent: "center", flexDirection: "row" }}>
        <PayPalButtons
            key='123'
            style={{ layout: "vertical", color: "silver", shape: "pill", size: "responsive", width: "50%" }}
            options={{intent: "donation"}}
            shippingPreference="NO_SHIPPING"
            currency = "USD"
            createOrder={paypalCreateOrder}
            onApprove={payPalOnApprove}
            catchError={paypalOnError}
            onError={paypalOnError}
            onCancel={paypalOnError}
            onClick={handleOrderClicked}
        />
      </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: "center", flexDirection: "row" }}>
        <PayPalButtons
            key='124'
            style={{ layout: "vertical", color: "silver", shape: "pill", size: "responsive", width: "50%" }}
            options={{intent: "subscription"}}
            NOSHIPPING="1"
            currency = "USD"
            createSubscription={paypalSubscribe}
            catchError={paypalOnError}
            onError={paypalOnError}
            onCancel={paypalOnError}
            onClick={handleOrderClicked}
            onApprove={handleSubscriptionSuccess}
        />
      </View>
    );
  }

  const paypalOnError = (err) => {
    console.log("Error: " + err)
  }

  const renderPayPalOnApprove = () => {
    if (isOnPayPalApprove) {
      let amount = 0;
      let currency_code = 'USD';
      if(approvedOrderDetails.purchase_units != null && approvedOrderDetails.purchase_units.length > 0){
        amount = approvedOrderDetails.purchase_units[0].amount.value;
        currency_code = approvedOrderDetails.purchase_units[0].amount.currency_code;
      }

      return <Navigate
      to={{
          pathname: "/payPalConfirm",
          search: "?name=" + approvedOrderDetails.payer.name.given_name + "&purpose=" + purpose + "&amount=" + amount + "&currency_code=" + currency_code,
          state: { referrer: "currentLocation" }
        }}
      />
    }
  }

  const renderPayPalOnSubscriptionApprove = () => {
    if(!isConfirmSubscription){
      return;
    }

    return <Navigate
      to={{
          pathname: "/payPalConfirmSubscription",
          search: "?amount=" + donationValue + "&purpose=" + purpose + "&subscriptionID=" + subscriptionID + "&currency_code=" + "USD" + "&isMonthly=" + isRecurringMonthly + "&isYearly=" + isRecurringYearly,
          state: { referrer: "currentLocation" }
        }}
      />      
  }

  const payPalOnApprove = (data, actions) =>{
    // Capture the funds from the transaction
    return actions.order.capture().then(function(details) {
      // Show a success message to your buyer
      //alert("Transaction completed by " + details.payer.name.given_name + ". Thank you!" );
      setApprovedOrderDetails(details)
      setDonationValue(null);
      setOnPayPalApprove(true);
      
      // OPTIONAL: Call your server to save the transaction
      return fetch("/paypal-transaction-complete", {
        method: "post",
        body: JSON.stringify({
          orderID: data.orderID
        })
      });
    });
  }

  const paypalCreateOrder = (data, actions) => {
    console.log(data);
                console.log(actions);
                if(!checkDonationValue() || !isDonationValueValid){
                  console.log('donation is invalid')
                  return;
                }
                if(!checkPurpose() || !isPurposeValid){
                  console.log('purpose is invalid')
                  return;
                }
                console.log('donation is valid')
                return actions.order.create({
                  purchase_units: [{
                    description: purpose,
                    amount: {
                      currency_code: "USD",
                      value: donationValue
                    }
                  }],
                  application_context: {
                    shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                  },
                  style: {
                    layout:  'vertical',
                    color:   'blue',
                    shape:   'pill',
                    label:   'paypal'
                  }
                });
              }

  const paypalSubscribe = (data, actions) => {
    if(!checkDonationValue() || !isDonationValueValid){
      console.log('donation is invalid')
      return;
    }
    if(!checkPurpose() || !isPurposeValid){
      console.log('purpose is invalid')
      return;
    }
    if(!checkFractionalSubscription()){
      setFractionalSubscription(true);
      return;
    }

    //let planID = 'P-1RT872045T645393VMFGL2IQ';
    let planID = 'P-4KS08521VU8227947ND7FCSY';
    if(SHUL === 'MD'){
      planID = isRecurringMonthly ? 'P-8W1837729U1811522MFGPGEA' : 'P-39546188XP231584XMGP6K7I';
    }

    if(SHUL === 'KM'){
      planID = 'P-0U658452BN024401EM5RNBFA';
    }

    console.log('donation is valid ' + donationValue + ' pland id : ' + planID);

    let subscriptionDetails = actions.subscription.create({
      plan_id: planID,
      quantity: Number(donationValue),
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });

    return subscriptionDetails;
  };    

  const isDecimal = (str) => {
    let value = Number(str);
    return(value % 1) !== 0;
  }

  const onRecurringMonthlyChange = (event) => {
    setIsRecurringYearly(false);
    setIsRecurringMonthly(true);
  }

  const onRecurringYearlyChange = (event) => {
    console.log(event.target.value);
    setIsRecurringYearly(true);
    setIsRecurringMonthly(false);
  }

  const renderRecurringOptions = () => {
    let isMobile = IsMobile();
    
    if(isRecurring && !isMobile) {
      if(SHUL === 'MD'){
        return (          
          <div class="center">
            <div class="child">
            <label>Monthly</label>
            <input type="radio" value="monthly" checked={isRecurringMonthly} onChange={onRecurringMonthlyChange}/>
            </div>
            <div class="child">
            <label>Yearly</label>
            <input type="radio" value="yearly" checked={isRecurringYearly} onChange={onRecurringYearlyChange}/>
            </div>
          </div>
        );        
      }
      
      return (          
        <div class="center">
          <div class="child">
          <label>Monthly</label>
          <input type="radio" value="monthly" checked={isRecurringMonthly} onChange={onRecurringMonthlyChange}/>
          </div>
        </div>
      );
    }

    if(isRecurring && isMobile){
      if(SHUL === 'MD'){
          return (          
            <div class="center">
              <Table border="0">
                <TableRow>
                  <TableCell style={{width: '95%', borderBottom:"none", borderTop:"none"}} align="left">
                    <input type="radio" value="monthly" checked={isRecurringMonthly} onChange={onRecurringMonthlyChange}/>
                    <label>Monthly</label>
                  </TableCell>
                </TableRow>            
                <TableRow>
                  <TableCell style={{width: '5%', borderBottom:"none", borderTop:"none"}} align="left">
                    <input type="radio" value="yearly" checked={isRecurringYearly} onChange={onRecurringYearlyChange}/>
                    <label>Yearly</label>
                  </TableCell>            
                </TableRow>            
              </Table>
            </div>      
          );
        }

        return (          
          <div class="center">
            <Table border="0">
              <TableRow>
                <TableCell style={{width: '95%', borderBottom:"none", borderTop:"none"}} align="left">
                  <input type="radio" value="monthly" checked={isRecurringMonthly} onChange={onRecurringMonthlyChange}/>
                  <label>Monthly</label>
                </TableCell>
              </TableRow>            
            </Table>
          </div>      
        );
    }
  }  

  const renderRecurringCheckBox = () => {
    return (<div>
        <input
            type="checkbox"
            checked={isRecurring}
            onChange={handleRecurrencyChange} />
            <label>Recurring</label>
      </div>);
  }

  const renderMemo = () => {
    if(SHUL === 'MD'){
      return (
          <div className="centerText">
                  <Text>
                    Please help us to continue our unbroken mesorah
                  </Text>
                  </div>
      );
    }    
  }

  const renderStatusBar = () => {  
    if(SHUL === 'OS'){
      return (<div>
          <div className="centerText">
          Our Shul is a <a href="http://en.wikipedia.org/wiki/501(c)_organization#501.28c.29.283.29">501(c)(3)</a> organization and all donations are tax-deductible.
          <ul>
            <li><Link to="/contactUs">Contact Us</Link></li>
          </ul>
          </div>
        </div>
        );
    }
  }

  return (
    <div className="App">
        {renderMemo()}
        {renderCurrencyInput()}
        {renderPurposeValidLabel()}
        {renderDonationIsTooSmallLabel()}
        {renderFractionalSubscription()}            
        {renderSuggestedDonations()}            
      <div className="center">
      <div id="wrapper">
      <div id="parent">
        {renderRecurringCheckBox()}
        {renderRecurringOptions()}
      </div>
      </div>
      </div>
      {renderPurposes()}
      <div className="gap-10"/>
      {renderOtherPurposeBox()}
      <div className="gap-5"/>
      {renderPayPalButtons()}
      {renderPhysicalAddress()}
      {renderStatusBar()}
      {renderPayPalOnApprove()}
      {renderPayPalOnSubscriptionApprove()}
    </div>
  );
}

export default PayPal