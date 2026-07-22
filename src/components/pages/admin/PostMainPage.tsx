import { useRef, useState  } from 'react';
import ReusableEditor from './TextEditor'
import { View } from 'react-native';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { postMainPageAdmin } from '../../shared/services/PostMainPageAdmin';

export default function PostMainPage(){
  const editorData = useRef<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [key] = useState(0);

  const handleEditorChange = (data: any) => {
    editorData.current = JSON.stringify(JSON.stringify(data));
  };

  const handleSave = () => {
    console.log('Saving editor content:', editorData.current);
    postMainPageAdmin.saveEditorData(editorData.current);
  };

  const handleDateChange = (value: any, context: any) => {
    if (context?.validationError) {
      return;
    }

    if (value && typeof value.toDate === 'function') {
      setStartDate(value);
      return;
    }

    if (value instanceof Date) {
      setStartDate(dayjs(value));
      return;
    }

    setStartDate(null);
  };

  const renderBeginDate = () => {
    return(
      <View style={{ display: 'flex', 
                     flexDirection: 'row', 
                     gap: 16, 
                     marginTop: 12, 
                     marginBottom: 12,
                     width: '100%', 
                     flexWrap: 'wrap', 
                     justifyContent: 'center' }}>
        <View style={{ minWidth: 240, width: 280 }}>
          <div style={{ marginBottom: 4, fontSize: 14, fontWeight: 500, textAlign: 'left' }}>Start</div>
          <DatePicker
            key={key}
            value={startDate}
            onChange={handleDateChange as any}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </View>

        <View style={{ minWidth: 240, width: 280 }}>
          <div style={{ marginBottom: 4, fontSize: 14, fontWeight: 500, textAlign: 'left' }}>End</div>
          <DatePicker
            key={key + 1}
            value={startDate}
            onChange={handleDateChange as any}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </View>
      </View>
    )
  }

  const renderSaveButton = () => {
    return(
      <View style={{ flex: 0.5, 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        marginTop: 12,
        width: '80%'  }}>
        <Button variant="contained" style={{ width: 'fit-content' }} onClick={handleSave}>Save</Button>
      </View>
    )
  }

  return(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
          {renderBeginDate()} 
          <ReusableEditor onChange={handleEditorChange} />
          {renderSaveButton()}
      </div>
    </LocalizationProvider>
  )
  
}
