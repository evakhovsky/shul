import { View, Text } from 'react-native';
import queryString from 'query-string'; 

function PayPalConfirmSubscription() {
    const renderConfirm = () => {
        const parsed = queryString.parse(window.location.search);
        
        let isParsed = parsed && parsed.amount && parsed.purpose && parsed.subscriptionID && parsed.isYearly && parsed.isMonthly;
        let currSign = '$';
        let subscriptionType = "monthly";
        if(!isParsed){
            return(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 10}}>
                   <Text style={{color: 'red'}}>There was an error processing your transaction</Text>
                </View>
            );
        }

        const isYearly = (parsed.isYearly.toLowerCase() === "true");

        if(parsed.currency_code !== 'USD'){
            currSign = '';
        }

        if(isYearly){
            subscriptionType = "annual";
        }

        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 10}}>
                <Text>Your {subscriptionType} subscription of {currSign}{parsed.amount} has been received. Subscription ID: {parsed.subscriptionID}</Text>
                <Text>It will be applied toward {parsed.purpose}</Text>
                <Text>Thank you for your support!</Text>
            </View>
        );
        
    }    

    return (
        <div>
            {renderConfirm()}
        </div>
    );
}

export default PayPalConfirmSubscription