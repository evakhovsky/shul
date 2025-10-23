import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {ZmanItem} from '../interfaces/IZmanim'
import { format } from 'date-fns';
import {Table, TableRow, TableCell} from '@mui/material';
import { View, Text } from 'react-native';

export interface ZmanimDialogProps {
  open: boolean;
  onClose: () => void;
  zmanim: ZmanItem;
  currentDate: Date;
  onSwitchLanguage: () => void;
  language: string;
}

export default function ZmanimDialog(props: ZmanimDialogProps) {
  const {open, onClose, zmanim, currentDate, onSwitchLanguage, language} = props;
  
    useEffect(() => {
      if (open) {
        console.log('Zmanim Dialog is now open!');
      } 
    }, [open]); // Depend on the isOpen state
    
    const formatDayDate = (date: Date):string => {
        if(!date){
            return '';
        }
        var lclDate = new Date(date);
        const formatString = 'MM-dd-yyyy EEEE';
        return format(lclDate, formatString);
    }

    const renderLanguage = () => {
        let switchLanguage = 'English';
        if(language === 'English'){
            switchLanguage = 'Hebrew';
        }

        return(
            <View style={{ flex: 0.5, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }}>
                <div>
                    <p className="link-btn"><Text style={{color: 'blue'}} onPress={() => onSwitchLanguage()}>Switch to {switchLanguage}</Text></p>
                </div>
            </View>
        )
    }

    const renderZmanim = () => {
        let languageZmanim = renderZmanimInEnglish;

        if(language === 'Hebrew'){
            languageZmanim = renderZmanimInHebrew;
        }

        return(<div>
            {languageZmanim()}
        </div>
        );
    }

    const renderZmanimInEnglish = () => {
        return(
        <Table>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.chatzotNightEng)}
                    {ZmanTableCellRightEng(zmanim.chatzotNightTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.alotHaShacharEng)}
                    {ZmanTableCellRightEng(zmanim.alotHaShacharTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.misheyakirEng)}
                    {ZmanTableCellRightEng(zmanim.misheyakirTime)}             
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.misheyakirMachmirEng)}
                    {ZmanTableCellRightEng(zmanim.misheyakirMachmirTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.dawnEng)}
                    {ZmanTableCellRightEng(zmanim.dawnTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.sunriseEng)}
                    {ZmanTableCellRightEng(zmanim.sunriseTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.sofZmanShmaEng)}
                    {ZmanTableCellRightEng(zmanim.sofZmanShmaTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.sofZmanTfillaEng)}
                    {ZmanTableCellRightEng(zmanim.sofZmanTfillaTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.chatzotEng)}
                    {ZmanTableCellRightEng(zmanim.chatzotTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.minchaGedolaEng)}
                    {ZmanTableCellRightEng(zmanim.minchaGedolaTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.minchaKetanaEng)}
                    {ZmanTableCellRightEng(zmanim.minchaKetanaTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.plagHaMinchaEng)}
                    {ZmanTableCellRightEng(zmanim.plagHaMinchaTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.sunsetEng)}
                    {ZmanTableCellRightEng(zmanim.sunsetTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.tzeit42minEng)}
                    {ZmanTableCellRightEng(zmanim.tzeit42minTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.tzeit50minEng)}
                    {ZmanTableCellRightEng(zmanim.tzeit50minTime)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeftEng(zmanim.tzeit72minEng)}
                    {ZmanTableCellRightEng(zmanim.tzeit72minTime)}
                </TableRow>
            </Table>
        );
    }

    const renderZmanimInHebrew = () => {
        return (
            <Table>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.chatzotNightTime)}
                    {ZmanTableCellRight(zmanim.chatzotNight)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.alotHaShacharTime)}
                    {ZmanTableCellRight(zmanim.alotHaShachar)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.misheyakirTime)}
                    {ZmanTableCellRight(zmanim.misheyakir)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.misheyakirMachmirTime)}
                    {ZmanTableCellRight(zmanim.misheyakirMachmir)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.dawnTime)}
                    {ZmanTableCellRight(zmanim.dawn)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.sunriseTime)}
                    {ZmanTableCellRight(zmanim.sunrise)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.sofZmanShmaTime)}
                    {ZmanTableCellRight(zmanim.sofZmanShma)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.sofZmanTfillaTime)}
                    {ZmanTableCellRight(zmanim.sofZmanTfilla)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.chatzotTime)}
                    {ZmanTableCellRight(zmanim.chatzot)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.minchaGedolaTime)}
                    {ZmanTableCellRight(zmanim.minchaGedola)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.minchaKetanaTime)}
                    {ZmanTableCellRight(zmanim.minchaKetana)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.plagHaMinchaTime)}
                    {ZmanTableCellRight(zmanim.plagHaMincha)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.sunsetTime)}
                    {ZmanTableCellRight(zmanim.sunset)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.tzeit42minTime)}
                    {ZmanTableCellRight(zmanim.tzeit50min)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.tzeit50minTime)}
                    {ZmanTableCellRight(zmanim.tzeit42min)}
                </TableRow>
                <TableRow>
                    {ZmanTableCellLeft(zmanim.tzeit72minTime)}
                    {ZmanTableCellRight(zmanim.tzeit72min)}
                </TableRow>
            </Table>
        );
    }

    function ZmanTableCellLeftEng(text?:string) {
        return (
            <TableCell sx={{py: 0.5, width: '80%', borderBottom: 'none', borderTop:"none" }} align="right">
                {text}
            </TableCell>
        );
    }

    function ZmanTableCellRightEng(text?:string) {
        return (
            <TableCell sx={{py: 0.5, width: '20%', borderBottom: 'none', borderTop:"none" }} align="left">
                {text}
            </TableCell>
        );
    }

    function ZmanTableCellRight(text?:string) {
        return (
            <TableCell sx={{py: 0.5, width: '80%', borderBottom: 'none', borderTop:"none" }} align="left">
                {text}
            </TableCell>
        );
    }

    function ZmanTableCellLeft(text?:string) {
        return (
            <TableCell sx={{py: 0.5, width: '20%', borderBottom: 'none', borderTop:"none" }} align="right">
                {text}
            </TableCell>
        );
    }

    return (
        <Dialog open={open} 
                onClose={onClose}
                fullWidth={true}
                maxWidth="sm">
          <DialogTitle>{formatDayDate(currentDate)}
            {onClose ? (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </DialogTitle>
            {renderLanguage()}
            {renderZmanim()}
        </Dialog>
      );
}