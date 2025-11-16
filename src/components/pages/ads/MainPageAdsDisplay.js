import React, { useCallback, useState } from 'react';
import postAdService from '../../shared/services/postAdService'
import { View, Text } from 'react-native';
import { convertFromRaw } from 'draft-js';
import { EditorState } from 'draft-js';
import PostAdEditor from '../../shared/controls/PostAdEditor'
import ImageViewer from './ImageViewer'

function MainPageAdsDisplay({ onFetchedPosts }) {
    const [activePosts, setActivePosts] = useState([]);
    
    const getNumberOfPosts = useCallback((posts) => {
        if (!posts || posts === undefined || posts === null) {
            onFetchedPosts(false);
            return;
        }

        let isThereAValidPost = posts.length > 0;
        onFetchedPosts(isThereAValidPost);
    }, [onFetchedPosts])

    const getAllImages = useCallback(async(posts) => {
        if(!posts || posts === null || posts === undefined || posts.length === 0){
            return;
        }

        console.log('calling useCallback MainPageAdsDisplay')
        
        for(var i = 0; i < posts.length; i++){
            var ad = posts[i];
            if(ad.numberOfImages === ad.images.length){
                continue;
            }

            var addImages = await postAdService.getAllPostAdImagesExceptFirstAuthenticated(ad)
            if(!addImages || addImages === null || addImages.length === 0){
                return;
            }

            for(var n = 0; n < posts.length; n++){
                if(ad.id === posts[n].id){
                    var postImages = [...posts[n].images, ...addImages];
                    posts[n].images = postImages;                    
                }                
            }
        }
        setActivePosts(posts);
    }, [])

    React.useEffect(() => {
        async function fetchData() {
            try {
                console.log('use effect')
                let posts = await postAdService.getApprovedPosts();
                if(!posts || posts === null){
                    setActivePosts(null)
                    return;
                }
                getNumberOfPosts(posts);
                setActivePosts(posts);
                await getAllImages(posts);                
            }
            catch(e){
                console.log(e);
            }
        }
        fetchData();
        return () => {            
        }
    }, [getNumberOfPosts,getAllImages]);

    const renderPostedAdDescription = (postedAd) => {
        if (!postedAd.isEditor && !postedAd.isHTML) {
            return <Text>{postedAd.description}</Text>
        }

        if (postedAd.isHTML && !postedAd.isEditor) {
            console.log("dangerouslySetInnerHTML");
            return (<div className="content" dangerouslySetInnerHTML={{ __html: postedAd.description }}></div>);
        }

        const contentState = convertFromRaw(JSON.parse(postedAd.description));
        const editorState = EditorState.createWithContent(contentState);

        return (
            <View style={{ borderBottomWidth: 0, borderTopWidth: 1 }}>
                <PostAdEditor
                    onRichTextEditorStateChanged={null}
                    initialEditorState={editorState}
                    isReadOnly={true} />
            </View>
        );
    }

    const renderName = (postedAd) => {
        return (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 10 }}>
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                    {postedAd.firstName} {postedAd.lastName}
                </Text>
                <Text>:</Text>
            </View>
        );
    }

    const renderAdmindAd = (postedAd) => {
        if (postedAd === undefined || postedAd === null || !postedAd.isAdminPost) {
            return;
        }

        return (
            <div>
                {renderPostedAdDescription(postedAd)}
                <ImageViewer images={postedAd.images}/>
            </div>
        );
    }

    const renderPostedAd = (postedAd, index) => {
        if (postedAd === undefined || postedAd === null || postedAd.isAdminPost) {
            return;
        }

        return (
            <div>
                {renderName(postedAd)}
                {renderPostedAdDescription(postedAd)}                
            </div>
        );
    }

    const isAdminAd = (activePost) => activePost.isAdminPost;

    const getAdminPosts = () => {
        return activePosts.filter(isAdminAd);
    }

    const renderAdminPosts = () => {
        if (!activePosts || activePosts.length === 0) {
            return;
        }

        const adminPosts = getAdminPosts();
        
        return (
            <div>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 25 }}>
                    <View style={{ flex: 0.7, justifyContent: "center", alignItems: "center" }}>
                        {adminPosts.map(renderAdmindAd)}
                    </View>
                </View>
            </div>
            );
    }

    const areThereNonAdminPosts = () => {
        if (!activePosts || activePosts.length === 0) {
            return false;
        }

        const adminPosts = getAdminPosts();
        if(adminPosts === null || adminPosts.length === 0){
            return true;
        }

        return adminPosts.length !== activePosts.length;
    }

    const renderPosts = () => {
        if (!activePosts || activePosts.length === 0) {
            return;
        }

        if(areThereNonAdminPosts()){
            return (
                <div>
                    <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flex: 0.5, justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <Text>Our mispallelim say</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                            {activePosts.map(renderPostedAd)}
                        </View>
                    </View>
                </div>
            );
        }
    }

    return (
        <div>
            {renderAdminPosts()}
            {renderPosts()}
        </div>
    );
}

export default MainPageAdsDisplay