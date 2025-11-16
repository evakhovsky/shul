import React, {useState } from 'react';
import { View } from 'react-native';
import ShowImageDlg from './ShowImageDlg'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

export function ImageViewer({images}) {
    const [width, setWidth] = useState(window.innerWidth);
    const [imageIdToShow, setImageIdToShow] = useState('');
    const [isShowImgDlg, setIsShowImgDlg] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    
    const isMobile = width <= 768;

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    React.useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        setImageIndex(0);

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [images]);

    const renderShowImgDlg = () => {
        return <ShowImageDlg showModal={isShowImgDlg}
            onClose={onShowImgDlgClose}
            imageIdToShow={imageIdToShow}
            source={"postAd"}/>
    }

    function onShowImgDlgClose() {
        setIsShowImgDlg(false);
    }

    const onShowPicture = (imageId) => {
        setImageIdToShow(imageId);
        setIsShowImgDlg(true);        
    };

    const handleNextPic = async () => {
        if(imageIndex < images.length){
            setImageIndex(imageIndex + 1);
        }
    }

    const handlePrevPic = async () => {
        if(imageIndex > 0){
            setImageIndex(imageIndex - 1);
        }
    }

    const renderCurrentImage = () => {
        if(!images || images === null || images === undefined || images.length === 0){
            return;
        }

        let width = isMobile ? 300 : 600;

        return(
            <View style={{ flex: 1, 
                justifyContent: 'center', 
                flexDirection: "row",
                marginTop: 15, 
                alignItems: 'center'}}>
                    <View style={{justifyContent: "flex-end"}}>
                        {renderPrevBtn()}
                    </View>
                    <button className="link-btn" onClick={() => onShowPicture(images[imageIndex].id)}>
                    <img 
                        style={{width: width, objectFit: 'contain'}}
                        src={`data:image/jpeg;base64,${images[imageIndex].image}`}
                        alt=''/>
                    </button>
                    <View style={{justifyContent: "flex-start"}}>
                        {renderNextBtn()}    
                    </View>                    
            </View>            
            );
            
    }

    const renderNextBtn = () => {
        let iLength = 0;
        if(images && images !== null && images !== undefined && images.length > 1){
            iLength = images.length;
        }

        if(iLength === 0){
            return;
        }

        if(imageIndex >= iLength - 1){
            return;
        }
        
        return(<button className="link-btn"  onClick={()=>handleNextPic()}>
                <ArrowForwardIos/>                        
               </button>
        );
    }

    const renderPrevBtn = () => {
        if(imageIndex <= 0){
            return;
        }

        return(<button className="link-btn" onClick={()=>handlePrevPic()}>
                <ArrowBackIos/>                        
               </button>
        );
    }

    return (
        <div>
            {renderCurrentImage()}
            {renderShowImgDlg()}
        </div>
    );
}

export default ImageViewer;