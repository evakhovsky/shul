import { useState } from 'react';
import '../authentication/Register.css';
import { TableCell, TableRow } from '@mui/material';

export const telephoneEntry = {
    TelephoneInput
};

export function TelephoneInput({onTelephoneChange, telephone, controlsStyle="table"}) {
    const [isTelephoneInvalid, setIsTelephoneInvalid] = useState(false);
    const [isTelephoneWrongFormat, setIsTelephoneWrongFormat] = useState(false);
    const tableStyle = controlsStyle;

    const renderTelephoneWrongFormat = () => {
        if (isTelephoneWrongFormat) {
          return <div className="gap-10"><span style={{color: "red"}}>Telephone format is invalid</span></div>;
        }
          return <div class="left"></div>;        
    }

    const renderTelephoneLabel = () => {
        if (isTelephoneInvalid) {
          return <div class="left"><label style={{color: "red"}}><b>Telephone</b></label></div>;
        } else {
          return <div class="left"><label><b>Telephone</b></label></div>;
        }
    }

    const handleTelephoneChange = async(event) => {
        let value = event.target.value;
        setIsTelephoneWrongFormat(false);
        
        if(!value) {
            setIsTelephoneInvalid(false);
            onTelephoneChange(value, true);
            return;
        }

        if(value.length < 10 && value.length > 0){
            setIsTelephoneInvalid(true);
            onTelephoneChange(value, false);
            return;
        }

        var pattern = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
        if (!value.match(pattern)) {      
            setIsTelephoneWrongFormat(true);
            setIsTelephoneInvalid(true);
            onTelephoneChange(value, false);
            return;
        }

        onTelephoneChange(value, true);
        setIsTelephoneInvalid(false);
    }

    const renderTelephoneControls = () => {
        
        if(tableStyle === "table"){
            return (
                <div>
                    <tr>
                        <td>
                                {renderTelephoneLabel()}                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input name="telephone" 
                                onChange={handleTelephoneChange} value={telephone}
                                title="Format must be XXX-XXX-XXXX"
                                placeholder="XXX-XXX-XXXX (optional)" />
                                {renderTelephoneWrongFormat()}
                                <div className="gap-10"></div>   
                            </td>
                    </tr>
                </div>
            );
        }

        if(tableStyle === "Table"){
            return (
                <div>
                    <TableRow>
                        <TableCell align="right">
                        {renderTelephoneLabel()} 
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        <input name="telephone" 
                                onChange={handleTelephoneChange} value={telephone}
                                placeholder="XXX-XXX-XXXX (optional)" />
                                {renderTelephoneWrongFormat()}
                        </TableCell>
                    </TableRow>
                </div>
            );
        }
    }

    return (
        <div class="left">
            {renderTelephoneControls()}
        </div>
    );
}

export default telephoneEntry;