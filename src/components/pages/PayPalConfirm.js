import { View, Text } from 'react-native';

function PayPalConfirm() {
    const renderConfirm = () => {
        const queryString = require('query-string');
        const parsed = queryString.parse(window.location.search);
        
        let isParsed = parsed && parsed.name && parsed.purpose && parsed.amount && parsed.currency_code;
        let currSign = '$';
        if(!isParsed){
            return(
                <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 10}}>
                   <Text style={{color: 'red'}}>There was an error processing your transaction</Text>
                </View>
            );
        }

        if(parsed.currency_code !== 'USD'){
            currSign = '';
        }

        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 10}}>
                <Text>Your donation of {currSign}{parsed.amount} has been received</Text>
                <Text>It will be applied toward {parsed.purpose}</Text>
                <Text>Thank you {parsed.name} for your support!</Text>
            </View>
        );
        
    }    

    return (
        <div>
            {renderConfirm()}
        </div>
    );
}

export default PayPalConfirm