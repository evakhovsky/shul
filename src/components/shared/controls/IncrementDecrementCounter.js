import React, { useState } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { View, Text } from 'react-native';

function IncrementDecrementCounter({maxUnits, onCounterChanged, initialCount, isWeeks}) {
    const [counter, setCounter] = useState(initialCount);
    
    React.useEffect(() => {
        setCounter(initialCount);
    },[initialCount]);

    const renderDaysWording = () => {
        let wording = isWeeks ? 'weeks' : 'days';
        if(counter === 1){
            wording = isWeeks ? 'week' : 'day';
        }

        return(
            <Text >{wording}</Text>
        );
    }

    const renderControl = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <Text >Duration:</Text>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: "center", alignItems: 'center'}}>
                    <button className="link-btn" style={{ marginLeft: '.5rem'}} onClick={handleIncrementCounter}>
                        <ArrowDropUpIcon/>    
                    </button>
                    <Text style={{ marginLeft: '.5rem'}} >{counter}</Text>
                    <button className="link-btn" style={{ marginLeft: '.5rem'}} onClick={handleDecrementCounter}>
                        <ArrowDropDownIcon/>    
                    </button>    
               </View>
               {renderDaysWording()}
            </View>
        );
    }
    
    const handleIncrementCounter = async () => {
        const maxNum = Number(maxUnits);

        if(counter === maxNum){
            return;
        }

        let count = counter + 1;
        setCounter(count)
        if(onCounterChanged){
            onCounterChanged(count)
        }
    }

    const handleDecrementCounter = async () => {
        if(counter === 1){
            return;
        }

        let count = counter - 1;
        setCounter(count)
        if(onCounterChanged){
            onCounterChanged(count)
        }
    }

  return (
    <div>
      {renderControl()}      
    </div>
  );
}

export default IncrementDecrementCounter;
