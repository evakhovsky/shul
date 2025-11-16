import WelcomePost from './WelcomePost'
import React, { useState, useRef } from 'react';
import { Text, View, SafeAreaView, TextInput, StyleSheet } from 'react-native';
//import DatePicker from '@mui/material/lab/DatePicker';
//import AdapterDateFns from '@mui/material/lab/AdapterDateFns';
//import LocalizationProvider from '@mui/material/lab/LocalizationProvider';
//import TextField from "@mui/material/core/TextField";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';
import UpdateSharp from '@mui/icons-material/UpdateOutlined';
import IncrementDecrementCounter from '../../shared/controls/IncrementDecrementCounter'
import postAdService from '../../shared/services/postAdService'
import PostAdEditor from '../../shared/controls/PostAdEditor'
import { EditorState, ContentState } from 'draft-js';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import utilservice from '../../shared/services/utilservice'
import authenticationService from '../../shared/services/authentication.service'
import { Navigate } from "react-router-dom";
import AttachFile from '@mui/icons-material/AttachFile';
import Cancel from '@mui/icons-material/Cancel';
import queryString from 'query-string';

function HomePagePost() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [userId, setUserId] = useState(false);
    const [gregorianDate, setGregorianDate] = useState(new Date());
    const [errorText, setErrorText] = useState('');
    const [text, onChangeText] = React.useState("");
    const [dateValid, setDateValid] = useState(true);
    const [textValid, setTextValid] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const [isHTML, setIsHTML] = useState(false);
    const [duration, setDuration] = useState(1);
    const [email, setEmail] = useState('');
    const [apiResponse, setApiResponse] = useState({status: false, error: null});
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
    const [initialEditorState, setInitialEditorState] = useState(false);
    const [rangeDates, setRangeDates] = useState([]);
    const [initialDurationDays, setInitialDurationDays] = useState(1);
    const [htmlPreviewString, setHTMLPreviewString] = React.useState('');
    const [showPostWarning, setShowPostWarning] = React.useState(false);
    const [isAdminPost, setIsAdminPost] = useState(false);
    const [name, setName] = React.useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isNameValid, setIsNameValid] = useState(false);
    const [isPosting, setPosting] = useState(false);
    const timerRef = useRef(null);    
    const wordsLimit = 300;
    const debugging = false;
    const [isUnAuthenticatedPosted, setIsUnAuthenticatedPosted] = useState(false);
    const [editToken, setEditToken] = React.useState('');
    const inputFile = useRef(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [showFileExtensionWarning, setShowFileExtensionWarning] = useState(false);
    const [showImageUploadError, setShowImageUploadError] = useState(false);
    const timerFileExtensionRef = useRef(null);
    const timerImageUploadErrorRef = useRef(null);
    const [listInputPics, setListInputPics] = React.useState([]);
    const [isDeletingImage, setIsDeletingImageageIdToShow] = useState(false);

    React.useEffect(() => {        
        return () => clearTimeout(timerRef.current);
    }, []);

    const styles = StyleSheet.create({
        input: {
          height: 300,
          marginLeft: 0,
          borderWidth: 1,
          padding: 10,
          marginTop: 10
        },
        text: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: 'bold',
            letterSpacing: 0.2,
            color: 'white',
        },
        updateBtnView: {
            flex: 0.95, 
            justifyContent: "flex-end", 
            alignItems: 'center', 
            flexDirection: "row", 
            marginRight: 10, 
            marginTop: 10
        }
    });

    const getInitialEditorState = async (userID) => {
        try {
            let postAd = await postAdService.getPostAd(userID);
            console.log(postAd)
            if(!postAd || !postAd.description){
                return null;                        
            }

        setGregorianDate(postAd.startDate);
        isDateValid(new Date(postAd.startDate));
        setRangeDates([postAd.startDate, postAd.endDate]);
        setInitialDurationDays(postAd.durationDays)
        setListInputPics(postAd.images);
        setIsAdminPost(postAd.isAdminPost);
        console.log(postAd.description);

        if(!postAd.isHTML && !postAd.isEditor){
            let contentState;
            contentState = {
                entityMap: {},
                blocks: [{
                  key: '18ql9',
                  text: postAd.description,
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                }],
            };
            
            if(isMobile){
                onChangeText(postAd.description);
            }

            return EditorState.createWithContent(convertFromRaw(contentState))            
        }

        if(!postAd.isHTML){
            const contentState = convertFromRaw(JSON.parse(postAd.description));
            const editorState = EditorState.createWithContent(contentState);
            return editorState;
        }

        setIsHTML(true);
        onChangeText(postAd.description);

        return null;
        }
        catch (e) {

        }
    }

    const recalculateDatesRange = (date, count) => {
        var result = new Date(date);
        result.setDate(result.getDate() + (count - 1));
        const startDate = utilservice.getDateFormatted(date);
        const endDate = utilservice.getDateFormatted(result);
        setRangeDates([startDate, endDate]);        
    }

    const fetchUnauthenticated = async (token) => {
        try {
            const initialState = await getInitialUnauthenticatedEditorState(token);
            if(!initialState || initialState === undefined || initialState === null){
                return;
            }
            console.log(initialState)
            setInitialEditorState(initialState)
            setInitialEditorState(null)            
        }
        catch(e) {
            
        }
    }
    const getInitialUnauthenticatedEditorState = async (token) => {
        try {
            let postAd = await postAdService.getPostAdUnauthenticated(token);
            console.log(postAd)
            if(!postAd || !postAd.description){
                setEditToken('');
                return null;                        
            }

        setEditToken(token);
        setGregorianDate(postAd.startDate);
        isDateValid(new Date(postAd.startDate));
        setRangeDates([postAd.startDate, postAd.endDate]);
        setInitialDurationDays(postAd.durationDays)
        
        if(!postAd.name || postAd.name === undefined || postAd.name === null || postAd.name.length < 1){
            setIsNameValid(false);
        }
        else{
            setIsNameValid(true);
            setName(postAd.name)
        }

        if(!postAd.email || postAd.email === undefined || postAd.email === null || postAd.email.length < 1){
            setIsEmailValid(false);
        }
        else{
            setIsEmailValid(true);
            setEmail(postAd.email)
        }
        
        let editorState;
        if(!utilservice.isJsonString(postAd.description)){
            editorState = EditorState.createWithContent(ContentState.createFromText(postAd.description))
        }
        else{
            const contentState = convertFromRaw(JSON.parse(postAd.description));
            editorState = EditorState.createWithContent(contentState);
        }

        setUserId(postAd.id);
        console.log(postAd.id)

        if(isMobile){
            onChangeText(editorState.getCurrentContent().getPlainText('\u0001'));
        }

        return editorState;
        }
        catch (e) {

        }
    }

    const fetchPostPage = async (userID) => {
        try {
            const initialState = await getInitialEditorState(userID);
            if(!initialState || initialState === undefined || initialState === null){
                return;
            }
            console.log(initialState)
            setInitialEditorState(initialState)
            setInitialEditorState(null)
        }
        catch(e) {
            
        }
    }

    const handleDateChange = async (date) => {
        setGregorianDate(date);
        
        if(!isDateValid(date)){
            return;
        }

        recalculateDatesRange(date, duration);
    }

    const isDateValid = (date) => {
        let now = new Date();
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if(date.getTime() < today.getTime()){
            setErrorText('Please choose current or forward date');
            setDateValid(false);
            return false;
        }

        if(textValid){
            setErrorText(null);
        }
        else{
            setErrorText('Exceeded number of words');
        }

        setDateValid(true);
        return true;
    }

    const onRichTextEditorStateChanged = (state) => {
        setEditorState(state);
        const editorText = state.getCurrentContent().getPlainText('\u0001');
        console.log(editorText)
        isTextValid(editorText)
        const html = getHTMLFromEditor();
        setHTMLPreviewString(html);
    }

    const renderGregorianDate = () => {
        return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // Centers horizontally
                        alignItems: 'center', // Centers vertically                        
                    }}
                    >
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                            <DatePicker
                            label="Start Date"
                            value={dayjs(gregorianDate)}
                            onChange={(newValue) => handleDateChange(newValue.toDate())}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>            
                );        
    }

    /*const renderGregorianDate = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: 'center', marginTop: 10}}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    value={gregorianDate}
                    format="MM/dd/yyyy EEEE"
                    onChange={handleDateChange}
                    renderInput={(props) => <TextField {...props} />}
                    />                
                </LocalizationProvider>
            </View>
        );
    }*/

    const renderPostAdEditor = () => {
        if(isMobile || isHTML){
            return;
        }

        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10, zIndex: 100}}>
                <View style={{flex: 0.98}}>
                    <PostAdEditor
                    onRichTextEditorStateChanged={onRichTextEditorStateChanged}
                    initialEditorState={initialEditorState}/>
                </View>
            </View>
        );    
    }

    const handleNameChange = async(value) => {
        setName(value);
        if(!value || value === undefined || value === null || value.length < 1){
            setIsNameValid(false);
            return;
        }
        
        setIsNameValid(true);
    }

    const handleEmailChange = async(value) => {
        setEmail(value);
        setIsEmailValid(utilservice.isEmailPatternValid(value));
        console.log("email " + value);
        console.log("email " + email);
    }

    const renderNameLabel = () => {
        if(!isNameValid){
            return (<Text>Name:
                        <Text style={{color: 'red'}}> *</Text>    
                    </Text>);
        }

        return <Text>Name:</Text>;
    }

    const renderEmailLabel = () => {
        if(!isEmailValid){
            return (<Text>Email:
                        <Text style={{color: 'red'}}> *</Text>    
                    </Text>);
        }

        return <Text>Email:</Text>;
    }

    const renderAttachLabel = () => {
        return <Text>Attach Pictures:</Text>;
    }

    const onUploadFileClick = () => {
        // `current` points to the mounted file input element
       inputFile.current.click();
    };

    const onAddFile = async (event) => {
        if(!event || !event.target || !event.target.files || event.target.files.length === 0){
            return;
        }

        var extension = event.target.files[0].name.split('.').pop()
        console.log(extension);
        switch(extension) {
            case 'JPG':
            case 'jpg':
            case 'GIF':
            case 'gif':
            case 'BMP':
            case 'bmp':
            case 'PNG':
            case 'png':
              break;
            default:
                setShowFileExtensionWarning(true);
                clearTimeout(timerFileExtensionRef.current);
                timerFileExtensionRef.current = setTimeout(hideExtensionWarning, 3000);                
                return;
        }

        event.stopPropagation();
        event.preventDefault();
        var file = event.target.files[0];
        console.log(file);
        
        setIsUploadingImage(true);
        if(isUserAuthenticated){
            var data = await postAdService.addImageAuthenticated(userId, email, file);
            console.log(data);
            if(!data || data === undefined || data === null){
                setShowImageUploadError(true);
                clearTimeout(timerImageUploadErrorRef.current);
                timerImageUploadErrorRef.current = setTimeout(hideImageUploadError, 3000);                
            }

            setListInputPics(data);
        }
        setIsUploadingImage(false);
    }    

    const renderInputPictures = () => {
        if(!listInputPics || listInputPics.length === 0){
            return;
        }

        return (<View style={{flexDirection: 'row'}}>
                    {listInputPics.map(renderThumbnailImage)}
                </View>);
    }

    const renderThumbnailImage = (thmbnail) => {
        return(
            <View style={{marginRight: 10, justifyContent: "center", alignItems: "center"}}>
                <button className="link-btn" >
                <img src={`data:image/jpeg;base64,${thmbnail.image}`} width={100} height={100} alt=''/>
                </button>
                <View style={{marginTop: 5, justifyContent: "center", alignItems: "center"}}>
                <button className="link-btn" onClick={() => onCancelPicture(thmbnail.id)}>
                    <Cancel style={{ color: '#B77263' }}/>
                </button>
                </View>                
            </View>
        );
    }
    
    const hideExtensionWarning = () => {
        setShowFileExtensionWarning(false)
        timerFileExtensionRef.current = null;
    }

    const hideImageUploadError = () => {
        setShowImageUploadError(false)
        timerFileExtensionRef.current = null;
    }
    
    const renderImageUploadError = () => {
        if(!showImageUploadError){
            return;
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10, marginTop: 10}}>
                <View style={{flex: 0.98, flexDirection: 'row', justifyContent: "flex-start" }}>
                    <Text style={{color: 'red'}}>Image upload error</Text>               
                </View>
            </View>
        );
    }

    const renderFileExtensionWarning = () => {
        if(!showFileExtensionWarning){
            return;
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10, marginTop: 10}}>
                <View style={{flex: 0.98, flexDirection: 'row', justifyContent: "flex-start" }}>
                    <Text style={{color: 'red'}}>Unsupported file format</Text>               
                </View>
            </View>
        );
    }

    const renderAttachFile = () => {
        if(isUserAuthenticated){
            return (
                <View style={{flex: 0.1, flexDirection: 'row', justifyContent: "flex-start", alignItems: "center" }}>
                    {renderAttachLabel()}
                    <button className="link-btn" onClick={onUploadFileClick}>
                        <AttachFile style={{justifyContent: "flex-start", marginRight: 10}}/>
                    </button>
                </View>
            );
        }
    }

    const renderAttachPicture = () => {
        return(
            <div>
                <View style={{flex: 0.98, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10, marginTop: 10, alignItems: "center"}}>
                    {renderAttachFile()}

                    <View style={{flex: 0.88, flexDirection: 'row', marginTop: 10, marginLeft: 10, justifyContent: "flex-start" }}>
                        {renderInputPictures()}
                    </View>

                    <input type='file' id='file' 
                        ref={inputFile} 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                        onChange={onAddFile} 
                        disabled={isUploadingImage}
                        style={{display: 'none'}}/>
                </View>                
            </div>
        );    
    }

    const renderName = () => {
        if(isUserAuthenticated){
            return;
        }

        return(
            <div>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10, marginTop: 10}}>
                    <View style={{flex: 0.98, justifyContent: "flex-end" }}>
                        {renderNameLabel()}
                    </View>                
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10}}>
                    <View style={{flex: 0.98}}>
                        <TextInput
                            placeholder="Enter the name post will appear under (required)"
                            autoCorrect={false}
                            style={{backgroundColor: 'white', borderColor: 'black'}}
                            value={name}
                            onChangeText={handleNameChange}
                        />
                    </View>
                </View>
            </div>
        );    
    }

    const renderEmail = () => {
        if(isUserAuthenticated){
            return;
        }

        return(
            <div>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10, marginTop: 10}}>
                    <View style={{flex: 0.98, justifyContent: "flex-end" }}>
                        {renderEmailLabel()}
                    </View>                
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10}}>
                    <View style={{flex: 0.98 }}>
                        <TextInput
                            placeholder="Enter your email (required)"
                            autoCorrect={false}
                            style={{backgroundColor: 'white', borderColor: 'black'}}
                            value={email}
                            onChangeText={handleEmailChange}
                        />
                    </View>
                </View>
            </div>
        );    
    }

    const renderHTMLPreview = () => {
        // only for debugging
        if(!debugging){
            return;
        }

        if(isHTML){
            return;
        }


        return (
            <View style={{flex: 1, justifyContent: "center"}}>
                <Text style={{textAlign: 'center', marginTop: 10}}>Preview</Text>
            <View style={{flex: .9, flexDirection: 'row', justifyContent: "center", marginLeft: 10, marginRight: 10, borderWidth: 1, 
            borderColor: "thistle",
            borderRadius: 5}}>
                <div className="content" dangerouslySetInnerHTML={{__html: htmlPreviewString}}></div>
            </View>
            </View>
        );
    }

    const renderPostWarning = () => {
        if(!showPostWarning){
            return;
        }

        if((isMobile || isHTML) && (!text || text === undefined || text.length === 0)){
            return;
        }

        if(!isMobile && !isHTML){
            const editorText = editorState.getCurrentContent().getPlainText('\u0001');
            if(!editorText || editorText === undefined || editorText.length === 0){
                return;
            }
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", marginTop: 20}}>
                <Text>Thank you for your post. It will show up on the main page after the admin approval</Text>
            </View>
        );
    }

    const renderUnAuthenticatedPosted = () => {
        if(!isUnAuthenticatedPosted){
            return;
        }

        return <Navigate
          to={{
            pathname: "/homePagePosted",
            search: "?email=" + email + "&name=" + name,
            state: { referrer: "currentLocation" }
          }}
        />
    }

    const renderReadOnlyPreview = () => {
        if(!debugging){
            return;
        }

        if(!isUserAuthenticated || isHTML){
            return;
        }

        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10}}>
                <View style={{flex: 0.98 }}>
                    <PostAdEditor
                    onRichTextEditorStateChanged={onRichTextEditorStateChanged}
                    initialEditorState={editorState}
                    isReadOnly={true}/>
                </View>
            </View>
        );    
    }
    
    const handleUpdateClick = async () => {
        setApiResponse(null);
        setPosting(true);
        let data = text;

        //let html = '';
        if (!isHTML && !isMobile){ // editor
            const state = editorState.getCurrentContent();
            //html = getHTMLFromEditor();
            console.log('----------------html----------------');
            //console.log(html);
            const editorText = editorState.getCurrentContent().getPlainText('\u0001');
            if (editorText.length < 2) {
                data = '';
            }
            else {
                data = JSON.stringify(convertToRaw(state));
            }
            console.log("----------------html----------------");            
            console.log(data);
        }

        let response = await postAdService.postAd(userId, duration, new Date(gregorianDate), data, isMobile ? false : isHTML, email, isMobile ? false : !isHTML, isAdminPost, name, isUserAuthenticated, editToken);

        setPosting(false);

        console.log(response);
        if(!response.status){
            response.error = !response.error ? 'Server call error' : response.error;
            setApiResponse(response);
            return;
        }

        if(!isUserAuthenticated){
            setIsUnAuthenticatedPosted(true);
        }

        console.log(apiResponse);
        setShowPostWarning(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(hidePost, 6000);
    }

    const hidePost = () => setShowPostWarning(false)

    const getHTMLFromEditor = () => {
        const state = editorState.getCurrentContent();
        const html = convertToHTML({
                styleToHTML: (style) => {
                    switch(style){
                        case 'HIGHLIGHT':
                            return <span style={{color: '#17202A'}} />;
                        case 'RED':
                            return <span style={{color: '#f44336'}} />;
                        case 'RED1':
                            return <span style={{color: '#e91e63'}} />;
                        case 'PURPLE':
                            return <span style={{color: '#9c27b0'}} />;
                        case 'PURPLE1':
                            return <span style={{color: '#673ab7'}} />;
                        case 'BLUE':
                            return <span style={{color: '#3f51b5'}} />;
                        case 'BLUE1':
                            return <span style={{color: '#2196f3'}} />;
                        case 'BLUE2':
                            return <span style={{color: '#03a9f4'}} />;
                        case 'OLDHUE':
                            return <span style={{color: '#00bcd4'}} />;
                        case 'OLDHUE1':
                            return <span style={{color: '#009688'}} />;
                        case 'GREEN':
                            return <span style={{color: '#4caf50'}} />;
                        case 'GREEN1':
                            return <span style={{color: '#8bc34a'}} />;
                        case 'GREEN2':
                            return <span style={{color: '#cddc39'}} />;
                        case 'YELLOW':
                            return <span style={{color: '#ffeb3b'}} />;
                        case 'YELLOW1':
                            return <span style={{color: '#ffc107'}} />;
                        case 'YELLOW2':
                            return <span style={{color: '#ff9800'}} />;
                        case 'MARS':
                            return <span style={{color: '#ff5722'}} />;
                        case 'BROWN':
                            return <span style={{color: '#795548'}} />;
                        case 'GREY':
                            return <span style={{color: '#607d8b'}} />;
                        case 'FONT_SIZE_12':
                            return <span style={{fontSize: '12px'}} />;
                        case 'FONT_SIZE_14':
                            return <span style={{fontSize: '14px'}} />;
                        case 'FONT_SIZE_16':
                            return <span style={{fontSize: '16px'}} />;
                        case 'FONT_SIZE_18':
                            return <span style={{fontSize: '18px'}} />;
                        case 'FONT_SIZE_20':
                            return <span style={{fontSize: '20px'}} />;
                        case 'FONT_SIZE_22':
                            return <span style={{fontSize: '22px'}} />;
                        case 'FONT_SIZE_24':
                            return <span style={{fontSize: '24px'}} />;
                        case 'FONT_SIZE_26':
                            return <span style={{fontSize: '26px'}} />;
                        case 'FONT_SIZE_28':
                            return <span style={{fontSize: '28px'}} />;
                        case 'FONT_SIZE_30':
                            return <span style={{fontSize: '30px'}} />;
                        case 'FONT_SIZE_36':
                            return <span style={{fontSize: '36px'}} />;
                            case 'FONT_SIZE_42':
                                return <span style={{fontSize: '42px'}} />;
                        case 'FONT_SIZE_48':
                            return <span style={{fontSize: '48px'}} />;
                        case 'BOLD':
                            return <span style={{fontWeight: 'bold'}} />;
                        default:
                            break;
                    }                  
                },
                blockToHTML: (block) => {
                    if (block.type === 'PARAGRAPH') {
                        return <span style={{fontSize: '20px'}} />;                    
                  }
                },
                entityToHTML: (entity, originalText) => {
                  if (entity.type === 'LINK') {
                    return <a href={entity.data.url}>{originalText}</a>;
                  }
                  return originalText;
                }
              })(state);

        return html;
    }

    const handleIsAdmin = async (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setIsAdminPost(value);
    }

    const onCancelPicture = async (imageId) => {
        setIsDeletingImageageIdToShow(true);
        console.log(imageId);
        var result = await postAdService.deleteImage(imageId);
        if(result){
            var picRemoved = listInputPics.filter((element) => { return element.id !== imageId; })
            setListInputPics(picRemoved);
        }
        setIsDeletingImageageIdToShow(false);
    };

    const renderDeletingImage = () => {
        if(!isDeletingImage){
            return;
        }

        return (
            <Text style={{flex: 0.3, marginBottom: 10, marginTop: 10, color: '#EE7358'}}>Deleting image</Text>                        
        );
    }
    
    const handleIsHTML = async (event) => {
        setApiResponse(null);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setIsHTML(value);
        await dummyAsync();
        setInitialEditorState(editorState)
        setInitialEditorState(null)
    };

    const dummyAsync = async() => {
        console.log(editorState)
    }

    const isSubmitValid = () => {
        return dateValid && textValid && isNameValid && isEmailValid && !isPosting;
    }

    const renderHTMLBtn = () => {
        if(isMobile || !isUserAuthenticated){
            return;
        }

        return (
            <label style={{ marginLeft: 10}} >
                        <input type="checkbox" 
                        checked={isHTML}
                        onChange={handleIsHTML}/>
                        HTML
                    </label>
        );
    }

    const renderAdminCheckBox = () => {
        if (!authenticationService.isAdministrator()) {
            return;
        }

        return (
            <label style={{ marginLeft: 10 }} >
                <input type="checkbox"
                checked={isAdminPost}
                    onChange={handleIsAdmin} />
                        Admin
            </label>
        );
    }

    const renderRangeDates = () => {
        if(rangeDates.length < 2){
            return;
        }

        return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10}}>
            <Text>{rangeDates[0]} - {rangeDates[1]}</Text>
        </View>
        );
    }

    const renderButtons = () => {
        if(!isMobile){
            return (
                    <View style={styles.updateBtnView}>
                        <div style={{ marginRight: '.5rem'}}>
                            <IncrementDecrementCounter key={initialDurationDays} maxUnits="21" onCounterChanged={onDurationChannged} 
                            initialCount = {initialDurationDays}/>
                        </div>
                        <Button onClick={()=>handleUpdateClick()} disabled = {!isSubmitValid()}>
                            <Text style={styles.text}>Post</Text>
                        </Button>
                        {renderHTMLBtn()}
                        {renderAdminCheckBox()}
                    </View>
                );
        }

        return (
            <View style={styles.updateBtnView}>
                <IncrementDecrementCounter maxUnits="7" onCounterChanged={onDurationChannged}
                initialCount = {initialDurationDays}/>
                <button className="link-btn" onClick={()=>handleUpdateClick()}>
                    <UpdateSharp/>                        
                </button>
                {renderHTMLBtn()}
            </View>
        );
    }
    
    const onDurationChannged = async (count) => {
        setApiResponse(null);
        setDuration(count);
        recalculateDatesRange(gregorianDate, count);
        isDateValid(new Date(gregorianDate));
    }

    const renderHeaderText = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <View style={{flex: .5, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <Text>Please enter the date you would like your post to appear on the main page</Text>                    
                </View>
            </View>
        );
    }

    const handleInputTextChange = async (text) => {
        setApiResponse(null);
        onChangeText(text);
        isTextValid(text);
    }

    const isTextValid = (inputText) => {
        if(!inputText || inputText.length === 0){
            if(errorText !== null && errorText !== undefined && errorText.length > 0 && errorText.localeCompare('Exceeded number of words') === 0){
                setErrorText(null);    
            }
            setTextValid(false);
            return false;
        }

        let words = inputText.split(' ').filter(Boolean);
        
        if(inputText && inputText.length > 0 && words.length > wordsLimit){
            setErrorText('Exceeded number of words');
            setTextValid(false);
            return false;
        }

        if(dateValid){
            setErrorText(null);
        }
        else{
            setErrorText('Please choose current or forward date');
        }

        setTextValid(true);
        return true;
    }

    const renderMobile = () => {
        if(!isMobile && !isHTML){
            return;
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "flex-end", marginRight: 10}}>
                <View style={{flex: 0.98 }}>
                <SafeAreaView>
                    <TextInput
                        multiline="true"
                        editable
                        style={styles.input}
                        onChangeText={handleInputTextChange}
                        placeholder="Your post text here"
                        value={text}
                    />                        
                    </SafeAreaView>
                    </View>
            </View>
        );
    }

    const renderApiValidation = () => {
        if(!apiResponse || !apiResponse.error){
            return;
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <View style={{flex: .5, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <Text style={{textAlign: 'center', color: 'red'}}>{apiResponse.error}</Text>
                </View>
            </View>
        );
    }

    const renderAuthenticationValidation = () => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <View style={{flex: .5, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                <Text style={{textAlign: 'center', color: 'red'}}>{errorText}</Text>
                </View>
            </View>
        );
    }

    const onAuthenticated = async (isAuthenticated, userId, isScreenMobile, userEmail) => {
        setIsUserAuthenticated(isAuthenticated);
        setIsMobile(isScreenMobile);
        if(isAuthenticated){
            setUserId(userId);
            setEmail(userEmail);
            setIsEmailValid(true);
            setIsNameValid(true);
            await fetchPostPage(userId);
            return;
        }                
    }

    window.onload = function (){
        onPageLoad();      
    }

    const onPageLoad = async () => {
        const parsed = queryString.parse(window.location.search);
        console.log(parsed);

        if(!parsed || !parsed.token || !parsed.edit) {
            return;
        }

        // potential edit
        if(parsed.edit === "true"){
            console.log("page is being editted");
            await fetchUnauthenticated(parsed.token);
            setTextValid(true);
            setErrorText(null);
        }
    }

    return (
        <div>
            <WelcomePost onAuthenticated={onAuthenticated}/>
            {renderHeaderText()}
            {renderGregorianDate()}
            {renderAuthenticationValidation()}
            {renderApiValidation()}
            {renderButtons()}
            {renderRangeDates()}
            {renderMobile()}
            {renderPostAdEditor()}
            {renderAttachPicture()}
            {renderFileExtensionWarning()}
            {renderImageUploadError()}
            {renderDeletingImage()}
            {renderName()}
            {renderEmail()}
            {renderHTMLPreview()}
            {renderReadOnlyPreview()}
            {renderPostWarning()}
            {renderUnAuthenticatedPosted()}
        </div>
    );
}

export default HomePagePost;