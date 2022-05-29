import axios from 'axios'
// const axios = require('axios').default;


export const registerAuth = async (url, payload) => {
    // let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCFfIeHfupYXw89FUOMeorhfQrndz7iIck";
    console.log(payload);
    return axios.post(url,payload)
    .then((response)=>{
        localStorage.setItem('idToken',response.data.idToken);
        localStorage.setItem('localId',response.data.localId);
        registerDB(payload);
        console.log("response regustrer aurh",response);
        return response.data;
    }).catch(function (error){
        console.log(error.response.data.error.message);
        error = errorMessage(error.response.data.error.message);
        return error;
    })
}

async function registerDB(payload){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let url2 = url+localStorage.getItem('localId')+".json?auth="+localStorage.getItem('idToken');
    delete payload.password;
    return axios.put(url2,payload)
    .then((response)=>{
        localStorage.removeItem('idToken');
        localStorage.removeItem('localId');
    });
}

export async function login(payload){
    let url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCFfIeHfupYXw89FUOMeorhfQrndz7iIck";
    return axios.post(url,payload)
    .then(async (response)=>{
        console.log("response", response.data);
        localStorage.setItem('idToken',response.data.idToken);
        localStorage.setItem('localId',response.data.localId);
        await getUsername();
        return response.data;
    }).catch(function (error){
        error = errorMessage(error.response.data.error.message);
        return error;
    })
}

export async function getUsername(user_id=null){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let user = user_id || localStorage.getItem('localId');
    let url2 = url+user+".json?auth="+localStorage.getItem('idToken');
    return axios.get(url2)
    .then((response)=>{
        localStorage.setItem('username',response.data.username);
        return response.data.username;
    }).catch(function (error){
        console.log("not log error username",error);
        return false;
    })
}

export function logout(){
    localStorage.removeItem('idToken');
    localStorage.removeItem('localId');
    localStorage.removeItem("sheet");
}

function errorMessage(error){
    let message ="";
    switch (error) {
        case "EMAIL_NOT_FOUND":
            message = "Email not exist";
            break;
        case "INVALID_PASSWORD":
            message = "Password wrong";
            break;
        case "EMAIL_EXISTS":
            message = "Email is already in use";
            break;
        default:
            message = "Error unknown";
            break;
    }
    return message;
}