import dateFnsFormat from 'date-fns/format';
import helperUtil from 'util'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SHUL = process.env.REACT_APP_SHUL;

export const postAdService = {
    postAd,
    getPostAd,
    getActivePosts,
    approve,
    getApprovedPosts,
    confirmPost,
    getPostAdUnauthenticated,
    getUnauthenticatedPosts,
    addImageAuthenticated,
    deleteImage,
    loadImage,
    getAllPostAdImagesExceptFirstAuthenticated,
    repostAd
};

async function postAd(usertID, duration, startDate, description, isHTML, email, isEditor, isAdminPost, name, isAuthenticated, token) {
    let postAdObject = getPostAdObject(usertID, duration, startDate, description, isHTML, email, isEditor, isAdminPost, name, isAuthenticated, token);

    const apiResponse = {
        status: false,
        error: null
    };

    await fetch(SERVER_URL + 'api/PostPageAd/PostAd', {
        method: 'POST', body: postAdObject, headers: {
            'Content-Type': 'application/json',
        }
    }).then(helperUtil.handleErrors)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(data.errors){
                apiResponse.status = false;
            }
            else{
                apiResponse.status = data.status;
                apiResponse.error = data.error;
            }
        }).catch(function (error) {
            console.log(error);
            apiResponse.status = false;
            apiResponse.error = 'Server request error';
        });

    return apiResponse;
}

async function getPostAdUnauthenticated(token){
    let postAd = null;

    await fetch(SERVER_URL + 'api/PostPageAd/GetPostAdUnauthenticated/' + token)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            postAd = data;
            postAd.durationDays = getDurationDays(postAd);
        })
        .catch(function (error) {
            console.log(error);
        });

    return postAd;
}

async function getPostAd(usertID) {
    let postAd = null;

    await fetch(SERVER_URL + 'api/PostPageAd/GetPostAd/' + usertID + '/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            postAd = data;
            postAd.durationDays = getDurationDays(postAd);
        })
        .catch(function (error) {
            console.log(error);
        });

    return postAd;
}

async function getUnauthenticatedPosts(){
    let postAds = null;

    await fetch(SERVER_URL + 'api/PostPageAd/GetUnauthenticatedAds/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            postAds = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return postAds;
}

async function repostAd(postAd){
    const dataToSend = getPostAdObjectFromRespose(postAd);

    const apiResponse = {
        status: false,
        error: null
    };

    await fetch(SERVER_URL + 'api/PostPageAd/RePostAd', {
        method: 'POST', body: dataToSend, headers: {
            'Content-Type': 'application/json',
        }
    }).then(helperUtil.handleErrors)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(data.errors){
                apiResponse.status = false;
            }
            else{
                apiResponse.status = data.status;
                apiResponse.error = data.error;
            }
        }).catch(function (error) {
            console.log(error);
            apiResponse.status = false;
            apiResponse.error = 'Server request error';
        });

    return apiResponse;
}

async function getAllPostAdImagesExceptFirstAuthenticated(postAd){
    let postAds = null;

    await fetch(SERVER_URL + 'api/PostPageAd/GetAllImagesExceptFirstAuthenticated/' + postAd.id + '/' + postAd.contactID + '/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            postAds = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return postAds;
}

async function loadImage(imageId) {
    let image = null;

    await fetch(SERVER_URL + 'api/PostPageAd/getImage/' + imageId)
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
            image = null;
        });

    return image;
}

async function getActivePosts() {
    let postAds = null;

    await fetch(SERVER_URL + 'api/PostPageAd/GetActiveAds/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            postAds = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return postAds;
}

async function approve(postedAd, isApproved) {
    postedAd.isAdminApproved = isApproved;

    const data = getPostAdObjectFromRespose(postedAd);

    const apiResponse = {
        status: false,
        error: null
    };

    await fetch(SERVER_URL + 'api/PostPageAd/ApproveAd', {
        method: 'POST', body: data, headers: {
            'Content-Type': 'application/json',
        }
    }).then(helperUtil.handleErrors)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            apiResponse.status = data.status;
            apiResponse.error = data.error;
        }).catch(function (error) {
            console.log(error);
            apiResponse.status = false;
            apiResponse.error = 'Server request error';
        });

    return apiResponse;
}

async function getApprovedPosts() {
    let postAds = null;

    await fetch(SERVER_URL + 'api/PostPageAd/GetApprovedAds/' + SHUL)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            postAds = data;
        })
        .catch(function (error) {
            console.log(error);
        });

    return postAds;
}

async function confirmPost(id, name, email) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", id);
    formData.append("name", name);

    try {
        const res = await axios.post(SERVER_URL + 'api/PostPageAd/ConfirmPost', formData);
        if(res.data){
            return res.data;
        }

        if(!res.data){
            console.log('not ok response confirmPost');
            return false;
        }
      } catch (ex) {
        console.log('exception');
        console.log(ex);
    }

    return false;
}

const getDurationDays = (postAd) => {
    try {
        const startDate = new Date(postAd.startDate);
        const endDate = new Date(postAd.endDate);

        var timeDiff = endDate.getTime() - startDate.getTime();

        // To calculate the no. of days between two dates
        var daysDiff = timeDiff / (1000 * 3600 * 24);

        return daysDiff + 1;
    }
    catch (e) {

    }

    return 1;
}

const getStartEndDates = (startDate, duration) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (duration - 1));

    const startDateFormatted = formatDayDate(startDate);
    const endDateFormatted = formatDayDate(endDate);

    return [startDateFormatted, endDateFormatted];
}

const getPostAdObjectFromRespose = (postedAd) => {
    const data = JSON.stringify({
        startDate: postedAd.startDate,
        endDate: postedAd.endDate,
        contactID: postedAd.contactID,
        description: postedAd.description,
        isHTML: postedAd.isHTML,
        entity: SHUL,
        userEmail: postedAd.userEmail,
        isEditor: postedAd.isEditor,
        isAdminApproved: postedAd.isAdminApproved,
        lastName: postedAd.lastName,
        firstName: postedAd.firstName,
        id: postedAd.id,
        isActive: postedAd.isActive,
        isAdminPost: postedAd.isAdminPost,
        isAuthenticated: postedAd.isAuthenticated,
        email: postedAd.email
    });

    return data;
}

const getPostAdObject = (usertID, duration, startDate, description, isHTML, email, isEditor, isAdminPost, name, isAuthenticated, token) => {
    const dateRange = getStartEndDates(startDate, duration);
    const contactId = !usertID || usertID === null || usertID === undefined ? '' : usertID;

    var id = isAuthenticated ? uuidv4() : token;
    if(id === undefined || id === null || id.length < 1){
        id = uuidv4();
    }

    const data = JSON.stringify({
        startDate: dateRange[0],
        endDate: dateRange[1],
        contactID: contactId,
        description: description,
        isHTML: isHTML,
        entity: SHUL,
        email: email,
        isEditor: isEditor,
        isAdminPost: isAdminPost,
        name: name,
        isAuthenticated: isAuthenticated,
        id: id,
        url: window.location.origin.toString()
    });
    
    return data;
}

async function addImageAuthenticated(usertID, email, file) {
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("usertID", usertID);
    formData.append("entity", SHUL);
    formData.append("id", uuidv4());    

    try {
        const res = await axios.post(SERVER_URL + 'api/PostPageAd/AddImageAuthenticated', formData);
        if(res.data){
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

async function deleteImage(id) {
    const formData = new FormData();
    formData.append("id", id);    

    try {
        const res = await axios.post(SERVER_URL + 'api/PostPageAd/DeleteImage', formData);
        if(res.data){
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

const formatDayDate = (date) => {
    if (!date) {
        return '';
    }
    var lclDate = new Date(date);
    const format = 'MM-dd-yyyy';
    return dateFnsFormat(lclDate, format);
}
export default postAdService;