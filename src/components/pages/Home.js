import React, { useState, useEffect } from 'react';
import useViewport from '../shared/ViewportProvider'
import { Text, StyleSheet, View } from 'react-native';
import logo from './images/mdShulInside.jpg';
import futureShul from './images/future_shul.jpg'
import rb from './images/rb.jpg'
import './Home.css';
import { Link } from "react-router-dom";
import hebrewDayInfo from '../shared/homeComponents/HebrewDateInfo'
import { authenticationService } from '../shared/services/Authenticationservice';
import MainPageAdsDisplay from '../pages/ads/MainPageAdsDisplay'

const SHUL = process.env.REACT_APP_SHUL;

function Home() {
    const [key, setKey] = useState(0); // Initial key for rerender

    useEffect(() => {
        const handleCustomEvent = (event) => {
            console.log('on custom event');
            console.log('Custom event received in JavaScript component:', event.detail.message);            
            forceDatePickerRerender();
        };

        console.log('registering custom event handler');

        window.addEventListener('refreshEvent', handleCustomEvent);

        return () => {
            window.removeEventListener('loginEvent', handleCustomEvent);
        };
    }, []);

    function forceDatePickerRerender() {
        setKey(prevKey => prevKey + 1); // Update the key to force re-render
    }

    const [entity, setEntity] = useState(false);
    const [address, setAddress] = useState(false);

    return IsMobile() ? <MobileHome entity={entity} address={address}/> : <DesktopHome entity={entity} address={address}/>;
}

function IsMobile() {
    const { width } = useViewport();
    const breakpoint = 768;

    return width < breakpoint;
}

const renderHebrewDay = () => {
    return (<div>
        <hebrewDayInfo.HebrewDayInfo format="desktop" />
    </div>);
}

function renderWelcomeName() {
    if (!authenticationService.isUserLoggedIn()) {
        return;
    }

    return <h4>Hello <span style={{ color: "blue" }}>{authenticationService.getUserFirstName()}</span></h4>;
}

function renderWelcomeHebrew() {
    if (!authenticationService.isUserLoggedIn()) {
        return <h5>!ברוכים הבאים</h5>;
    }

    return <h5>!ברוך הבא</h5>;
}

const renderMemo = () => {
    return (
        <div className="centerText">
            <Text>
                Please click on the Donate link below to help the shul
                </Text>
        </div>
    );
}

function MobileHome(props) {
    const [showLogoPicture, setShowLogoPicture] = useState(false);

    const onFetchedPosts = async (areThereValidPosts) => {
        setShowLogoPicture(!areThereValidPosts);
    }

    return (<div className='home'>
                <View style={{ justifyContent: "center" }}>
                    {renderHebrewDay()}
                </View>
                <div className="centerText">
                    {renderWelcomeName()}
                    {renderWelcomeHebrew()}
                </div>
                <div className="centerText">
                </div>
                <HousePic showLogoPicture={true} />
                    {renderMemo()}
                <div className="centerText">
                    <Link to="/paypal">Donate</Link>
                </div>
                <MainPageAdsDisplay onFetchedPosts={onFetchedPosts} />
                <br></br>
            </div>
    )
}

function DesktopHome(props) {
    const [showLogoPicture, setShowLogoPicture] = useState(false);

    const onFetchedPosts = async (areThereValidPosts) => {
        setShowLogoPicture(!areThereValidPosts);
    }

    return (
        <div>
            <div className="flex-container">
                {renderHebrewDay()}
            </div>
            <div className="centerText">
                {renderWelcomeName()}
                {renderWelcomeHebrew()}
            </div>
            <div className="flex-container">
                <HousePic showLogoPicture={showLogoPicture} />
            </div>
            {renderMemo()}
            <div className="centerText">
                    <Link to="/paypal">Donate</Link>
            </div>
            <MainPageAdsDisplay onFetchedPosts={onFetchedPosts} />
            <br></br>
        </div>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 400,
    },
});

function HousePic({ showLogoPicture }) {
    const height1 = IsMobile() ? "80" : "120";
    if (SHUL === 'MD') {
        return (
            <View style={styles.container}>
                <img class="center-fit" src={logo} height={height1} alt="House" style={{ padding: 4, alignSelf: 'flex-start' }} />
            </View>);
    }

    if (SHUL === 'OS') {
        return (
            <View style={styles.container}>
                <img class="center-fit" src={futureShul} height={height1} alt="House" style={{ padding: 4, alignSelf: 'flex-start' }} />
            </View>);
    }

    if (SHUL === 'KM') {
        return (
            <View style={styles.container}>
                <img class="center-fit" src={rb} height={height1} alt="House" style={{ padding: 4, alignSelf: 'flex-start' }} />
            </View>);
    }
}

export default Home;