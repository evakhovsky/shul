import React, { useState, useEffect } from 'react';
import useViewport from '../shared/ViewportProvider'
import { Text, StyleSheet, View } from 'react-native';
import logo from './images/mdShulInside.jpg';
import futureShul from './images/future_shul.jpg'
import rb from './images/rb.jpg'

const SHUL = process.env.REACT_APP_SHUL;

function Home() {
    const [entity, setEntity] = useState(false);
    const [address, setAddress] = useState(false);

    return (<div>
        <h1>Home</h1>
    </div>);

    return IsMobile() ? <MobileHome entity={entity} address={address}/> : <DesktopHome entity={entity} address={address}/>;
}

function IsMobile() {
    const { width } = useViewport();
    const breakpoint = 768;

    return width < breakpoint;
}

function MobileHome(props) {
    const [showLogoPicture, setShowLogoPicture] = useState(false);

    return (
        <View>
            <div className='home'>
                <div className="centerText">
                </div>
                <HousePic showLogoPicture={showLogoPicture} />
                <br></br>
            </div>
        </View>
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
                <HousePic showLogoPicture={showLogoPicture} />
            </div>
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