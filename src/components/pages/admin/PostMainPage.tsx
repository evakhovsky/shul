import { useRef  } from 'react';
import ReusableEditor from './TextEditor'
import { View } from 'react-native';
import Button from '@mui/material/Button';
import { postMainPageAdmin } from '../../shared/services/PostMainPageAdmin';

export default function PostMainPage(){
  const editorData = useRef<string>("");

  const handleEditorChange = (data: any) => {
    editorData.current = JSON.stringify(JSON.stringify(data));
  };

  const handleSave = () => {
    console.log('Saving editor content:', editorData.current);
    postMainPageAdmin.saveEditorData(editorData.current);
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
