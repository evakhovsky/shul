import { useState } from 'react';
import ReusableEditor from './TextEditor'
import { View } from 'react-native';
import Button from '@mui/material/Button';

export default function PostMainPage(){
  const [editorData, setEditorData] = useState<any>(null);

  const handleEditorChange = (data: any) => {
    setEditorData(data);
  };

  const handleSave = () => {
    console.log('Saving editor content:', editorData);
  };

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
    <div>
        <ReusableEditor onChange={handleEditorChange} />
        {renderSaveButton()}
    </div>
  )
  
}
