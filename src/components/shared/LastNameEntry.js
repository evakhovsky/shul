import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export const lastNameEntry = {
    LastNameInput
};

export function LastNameInput({onLastNameChange, 
                               name, 
                               labelText='Last Name',
                               controlsStyle="table", 
                               applyRegularExpression=true}) {
    const [isLastNameValid, setLastNameValid] = useState(true);
    const placeHolder = 'Enter ' + labelText + ' (optional)';

    const tableStyle = controlsStyle;

    const handleLastNameChange = async(event) => {
        let value = event.target.value;
        
        if(!value){
            setLastNameValid(true);
            onLastNameChange(value, true);
            return;
        }
    
        if(value.length > 60){
            setLastNameValid(false);
            onLastNameChange(value, false);
            return;
        }
        if(applyRegularExpression){
            var pattern = new RegExp(/^[A-Za-z .]+$/);
            if (!pattern.test(value)) {
                console.log('non-alpha');
                setLastNameValid(false);
                onLastNameChange(value, false);
                return;
            }
        }

        setLastNameValid(true);
        onLastNameChange(value, true);
    }

    const renderLastNameLabel = () => {
        if (!isLastNameValid) {
            return <div class="left"><label style={{color: "red"}}><b>{labelText}</b></label></div>;
        } else {
            return <div class="left"><label><b>{labelText}</b></label></div>;
        }
    }

    const renderLastNameControls = () => {        
        if(tableStyle === "table"){
            return (
                <div>
                    <tr>
                        <td>
                            {renderLastNameLabel()}               
                        </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                <input
                                placeholder={placeHolder} 
                                alt={placeHolder} 
                                title={placeHolder}
                                onChange={handleLastNameChange} value={name || ''}/>
                                </div>
                                <div className="gap-10"></div>   
                            </td>
                    </tr>
                </div>
            );                
        }

        if(tableStyle === "Table"){
            console.log('super jopa 22');
            return (
            <div>
                <TableRow>                        
                        <TableCell  align="right" component="td" scope="row">
                        {renderLastNameLabel()}    
                        </TableCell>
                        <TableCell>
                        <input placeholder="Enter first name (required)" 
                            name="lastName" 
                            onChange={handleLastNameChange} value={name || ''}
                            required />
                        </TableCell>
                    </TableRow>
            </div>
            );
        }
    }

    return (
        <div class="left">
            {renderLastNameControls()}
        </div>
    );
}

export default lastNameEntry;