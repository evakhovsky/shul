import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export const firstNameEntry = {
    FirstNameInput
};

export function FirstNameInput({onFirstNameChange, name, controlsStyle="table"}) {
    const [isFirstNameValid, setFirstNameValid] = useState(false);
    
    React.useEffect(() => {
        if(name && name.length > 0){
            setFirstNameValid(true);
        }
    }, [name]);

    const tableStyle = controlsStyle;

    const handleFirstNameChange = async(event) => {
        let value = event.target.value;
        
        if(!value){
          setFirstNameValid(false);
          onFirstNameChange(value, false);
          return;
        }
    
        if(value.length > 60){
          setFirstNameValid(false);
          onFirstNameChange(value, false);
          return;
        }
        var pattern = new RegExp(/^[A-Za-z .]+$/);
        if (!pattern.test(value)) {
            console.log('non-alpha');
            setFirstNameValid(false);
            onFirstNameChange(value, false);
            return;
        }

        setFirstNameValid(true);
        onFirstNameChange(value, true);
    }

    const renderFirstNameLabel = () => {
        if (!isFirstNameValid) {
          return <div class="left"><label style={{color: "red"}}><b>First Name</b></label></div>;
        } else {
          return <div class="left"><label><b>First Name</b></label></div>;
        }
    }

    const renderFirstNameControls = () => {
        
        if(tableStyle === "table"){
            return (
                <div>
                    <tr>
                        <td>
                            {renderFirstNameLabel()}               
                        </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                <input name="firstName" 
                                placeholder="Enter First Name (required)" 
                                onChange={handleFirstNameChange} value={name || ''}/>
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
                        {renderFirstNameLabel()}    
                        </TableCell>
                        <TableCell>
                        <input placeholder="Enter first name (required)" 
                            name="firstName" 
                            onChange={handleFirstNameChange} value={name || ''}
                            required />
                        </TableCell>
                    </TableRow>
            </div>
            );
        }
    }

    return (
        <div class="left">
            {renderFirstNameControls()}
        </div>
    );
}

export default firstNameEntry;