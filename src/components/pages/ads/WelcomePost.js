import authenticationService from '../../shared/services/authentication.service'
import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import helperUtil from '../../shared/Util'

function WelcomePost({onAuthenticated}) {
    const [loggedInFirstName, setLoggedInFirstName] = useState('');

    const styles = StyleSheet.create({
        titleText: {
          fontSize: 20,
          fontWeight: "bold",
          justifyContent: "center", 
          alignItems: 'center'
        },
        welcomeText: {
            fontSize: 18,
            fontWeight: "bold",
            justifyContent: "center", 
            alignItems: 'center'
        },        
        welcomeNameText: {
            fontSize: 18,
            fontWeight: "bold",
            justifyContent: "center", 
            alignItems: 'center',
            color: 'blue'
          }
    });

    const renderWelcomeMemo = () => {
        if(!isUserLoggedIn()){
            return;
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <Text style={styles.welcomeText}>Hello</Text>
                <Text style={styles.welcomeNameText}> {loggedInFirstName}!</Text>
            </View>
        );
    }

    const isUserLoggedIn = () => {
        let isMobile = helperUtil.IsMobile();
        if(!authenticationService.isUserLoggedIn()){
            onAuthenticated(false, null, isMobile);
            return false;
        }
    
        if(!loggedInFirstName){
          var firstName = authenticationService.getUserFirstName();
          if(!firstName){
            onAuthenticated(false, null, isMobile);
            return false;
          }
    
          setLoggedInFirstName(authenticationService.getUserFirstName());
          onAuthenticated(true, authenticationService.getUserID(), isMobile, authenticationService.getUserEmail());
        }
        
        return true;
    }

    return (
        <div>
            {renderWelcomeMemo()}
        </div>
    );
}

export default WelcomePost;