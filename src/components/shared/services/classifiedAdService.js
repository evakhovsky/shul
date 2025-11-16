import axios from "axios";
import helperUtil from 'util'

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

export const classifiedAdService = {
    addNewImage,
    cleanupIntermediaryAd,
    loadImage,
    deleteImage,
    postAd,
    confirmAd,
    fetchClassifiedsForAdmin,
    approveAd,
    getForEdit,
    deleteAd,
    getFirstInCategories,
    getAd,
    getAllImagesExceptFirst,
    getAllForCategory
};

async function loadImage(imageId){
    console.log('about to call loadImage ' + SERVER_URL + 'api/Classified/getImage/' + imageId);
    let image = null;

    await fetch(SERVER_URL + 'api/Classified/getImage/' + imageId)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            image = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return image;
}

async function deleteImage(adId, imgId){
    console.log('about to call deleteImage ' + adId + ' imgId ' + imgId);

    const formData = new FormData();
    formData.append("adId", adId);
    formData.append("imageId", imgId);

    try {
        const res = await axios.post(SERVER_URL + 'api/Classified/DeleteAdImage', formData);
        if(res.data){
            console.log('ok response');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function cleanupIntermediaryAd(adId){
    console.log('about to call cleanupIntermediaryAd adId ' + adId);

    const formData = new FormData();
    formData.append("adId", adId);    

    try {
        const res = await axios.post(SERVER_URL + 'api/Classified/CleanupIntermidearyAd', formData);
        if(res.data){
            console.log('ok response');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function addNewImage(file, adId, imageId) {
    console.log('about to call postImage ' + adId);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("adId", adId);
    formData.append("imageId", imageId);

    try {
        const res = await axios.post(SERVER_URL + 'api/Classified/ImportFile', formData);
        if(res.data){
            console.log('ok response');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function postAd(title, 
                      shortDescription,
                      data,
                      pageId,
                      telephone,
                      email,
                      userId,
                      duration,
                      category) {
                            
    let contactId = userId === undefined ? '' : userId;

    const postData = JSON.stringify({
        pageId: pageId,
        title: title,
        shortDescription: shortDescription,
        editorState: data,
        telephone: telephone,
        email: email,
        contactId: contactId,
        entity: SHUL,
        duration: duration,
        url: window.location.origin.toString(),
        category: category
    });

    let result = false;

    try {
    await fetch(SERVER_URL + 'api/Classified/PostAd', {
        method: 'POST', body: postData, headers: {
            'Content-Type': 'application/json',
        }
    }).then(helperUtil.handleErrors)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            result = data;
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });
    } catch (ex) {
        console.log('exception');
        console.log(ex);
        result = false;
    }

    return result;
}

async function confirmAd(email, token) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", token);
    
    console.log('token');
    console.log(token);

    try {
        const res = await axios.post(SERVER_URL + 'api/Classified/ConfirmAd', formData);
        if(res.data){
            console.log('ok response confirmAd');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response confirmAd');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function fetchClassifiedsForAdmin(){
    console.log('about to call loadImage ' + SERVER_URL + 'api/Classified/getForAdmin/' + SHUL);
    let ads;

    await fetch(SERVER_URL + 'api/Classified/getForAdmin/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            ads = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return ads;
}

async function approveAd(adId){
    console.log('about to call approveAd adId ' + adId);

    const formData = new FormData();
    formData.append("adId", adId);    

    try {
        const res = await axios.post(SERVER_URL + 'api/Classified/ApproveAd', formData);
        if(res.data){
            console.log('ok response');
            return res.data.isAdminApproved;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function getForEdit(adId){
    console.log('about to call loadImage ' + SERVER_URL + 'api/Classified/getForEdit/' + adId);
    let ad;

    await fetch(SERVER_URL + 'api/Classified/getForEdit/' + adId)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            ad = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return ad;
}

async function deleteAd(adId){
    console.log('about to call deleteAd adId ' + adId);

    const formData = new FormData();
    formData.append("adId", adId);    

    try {
        const res = await axios.post(SERVER_URL + 'api/Classified/DeleteAd', formData);
        if(res.data){
            console.log('ok response');
            return res.data;
        }

        if(!res.data){
            console.log('not ok response');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

async function getFirstInCategories(){
    console.log('about to call getFirstInCategories ' + SERVER_URL + 'api/Classified/getFirstInCategory/' + SHUL);
    let ads;

    await fetch(SERVER_URL + 'api/Classified/getFirstInCategory/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            ads = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return ads;
}

async function getAd(id){
    console.log('about to call getAd ' + SERVER_URL + 'api/Classified/getAd/' + id);
    let ad;

    await fetch(SERVER_URL + 'api/Classified/getAd/' + id)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            ad = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return ad;
}

async function getAllImagesExceptFirst(id){
    console.log('about to call getAllImagesExceptFirst ' + SERVER_URL + 'api/Classified/getAllImagesExceptFirst/' + id);
    let images;

    await fetch(SERVER_URL + 'api/Classified/getAllImagesExceptFirst/' + id)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            images = data;            
        })
        .catch(function (error) {
            console.log(error);
        });

    return images;
}

async function getAllForCategory(category){
    console.log('about to call getAllForCategory ' + SERVER_URL + 'api/Classified/getAllInCategory/' + category + "/" + SHUL);

    let ads;

    await fetch(SERVER_URL + 'api/Classified/getAllInCategory/' + category + "/" + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(!data){
                console.log('not ok response');
                return false;
            }

            ads = data;            
        })
        .catch(function (error) {
            console.log(error);
        });

    return ads;
}

export default classifiedAdService