import Modal from 'react-bootstrap/Modal'
import dateFnsFormat from 'date-fns/format';
import Table from 'react-bootstrap/Table'
import {TableRow, TableCell} from '@mui/material';
import { View, Text } from 'react-native';

export function ZmanimDlg({onClose, 
                           showModal, 
                           zmanim, 
                           currentDate, 
                           onSwitchLanguage, 
                           language,
                           astronomicalTimes}) {
    const closeModal = () => {
        console.log('closeModal');
        onClose();
    }

    const formatDayDate = (date) => {
        if(!date){
            return '';
        }
        var lclDate = new Date(date);
        const format = 'MM-dd-yyyy EEEE';
        return dateFnsFormat(lclDate, format);
    }

    const renderLanguage = () => {
        let switchLanguage = 'English';
        if(language === 'English'){
            switchLanguage = 'Hebrew';
        }

        return(
            <View style={{ flex: 0.5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                <div>
                    <p className="link-btn"><Text style={{color: 'blue'}} onClick={() => onSwitchLanguage()}>Switch to {switchLanguage}</Text></p>
                </div>
            </View>
        )
    }

    const renderAstronomicalTimes = () => {
        if(!astronomicalTimes || astronomicalTimes === undefined || astronomicalTimes === null || astronomicalTimes.length === 0 ||
            astronomicalTimes.results === undefined || astronomicalTimes.results === null || !astronomicalTimes.results){
            return;
        }

        return(
            <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                {renderAstronomicalTimesTitle()}
                <Table striped hover size="sm">
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        First Light
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.first_light}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Dawn
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.dawn}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Sunrise
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.sunrise}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Solar noon
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.solar_noon}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Sunset
                        </TableCell>
                        <TableCell style={{width: '23%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.sunset}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Dusk
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.dusk}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Last light
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.last_light}
                        </TableCell>                    
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: '70%', borderBottom:"none", borderTop:"none"}} align="right">
                        Day length
                        </TableCell>
                        <TableCell style={{width: '30%', borderBottom:"none", borderTop:"none"}} align="left">
                        {astronomicalTimes.results.day_length}
                        </TableCell>                    
                    </TableRow>
                </Table>
            </View>
        )
    }

    const renderAstronomicalTimesTitle = () => {
        if(!astronomicalTimes){
            return;
        }

        return(
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
                <div>
                    <p><Text style={{color: '#c83c1e'}}>Astronomical Times (not halachic)</Text></p>
                </div>
            </View>
        )
    }

    const renderZmanim = () => {
        let languageZmanim = renderZmanimInEnglish;

        if(language === 'Hebrew'){
            languageZmanim = renderZmanimInHebrew;
        }

        return(
            <section>
                <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton style={{borderBottom:"none", borderTop:"none"}}>
                <Modal.Title>
                {formatDayDate(currentDate)}
                </Modal.Title>
                </Modal.Header>            
                <Modal.Body scrollable="true">
                {renderLanguage()}
                {languageZmanim()}
                {renderAstronomicalTimes()}
                </Modal.Body>
                </Modal>
            </section>
        );
    }

    const renderZmanimInEnglish = () => {
        return(
        <Table striped hover size="sm">
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.chatzotNightEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                    {zmanim.chatzotNightTime}
                    </TableCell>                    
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                    {zmanim.alotHaShacharEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.alotHaShacharTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.misheyakirEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                    {zmanim.misheyakirTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">                        
                        {zmanim.misheyakirMachmirEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">                        
                        {zmanim.misheyakirMachmirTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.dawnEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.dawnTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sunriseEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sunriseTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sofZmanShmaEng}                        
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sofZmanShmaTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sofZmanTfillaEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sofZmanTfillaTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.chatzotEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.chatzotTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.minchaGedolaEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.minchaGedolaTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">                        
                        {zmanim.minchaKetanaEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.minchaKetanaTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.plagHaMinchaEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.plagHaMinchaTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sunsetEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">                        
                        {zmanim.sunsetTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.tzeit42minEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.tzeit42minTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.tzeit50minEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.tzeit50minTime}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.tzeit72minEng}
                    </TableCell>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.tzeit72minTime}
                    </TableCell>
                </TableRow>
            </Table>
        );
    }

    const renderZmanimInHebrew = () => {
        return (
            <Table striped hover size="sm">
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.chatzotNightTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.chatzotNight}
                    </TableCell>                    
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.alotHaShacharTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.alotHaShachar}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.misheyakirTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.misheyakir}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.misheyakirMachmirTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.misheyakirMachmir}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.dawnTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.dawn}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sunriseTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sunrise}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sofZmanShmaTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sofZmanShma}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sofZmanTfillaTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sofZmanTfilla}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.chatzotTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.chatzot}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.minchaGedolaTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.minchaGedola}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.minchaKetanaTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.minchaKetana}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.plagHaMinchaTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.plagHaMincha}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.sunsetTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.sunset}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.tzeit42minTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.tzeit42min}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.tzeit50minTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.tzeit50min}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{width: '20%', borderBottom:"none", borderTop:"none"}} align="right">
                        {zmanim.tzeit72minTime}
                    </TableCell>
                    <TableCell style={{width: '80%', borderBottom:"none", borderTop:"none"}} align="left">
                        {zmanim.tzeit72min}
                    </TableCell>
                </TableRow>
            </Table>
        );
    }

    return (
        <div>
            {renderZmanim()}            
        </div>
    );
}

export default ZmanimDlg;