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
    });
}

async function registerDB(payload){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let url2 = url+localStorage.getItem('localId')+".json?auth="+localStorage.getItem('idToken');
    delete payload.password;
    return axios.put(url2,payload)
    .then((response)=>{
        localStorage.removeItem('idToken');
        localStorage.removeItem('localId');
        console.log(response);
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
        return true;
    })
}

export async function getUsername(){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let url2 = url+localStorage.getItem('localId')+".json?auth="+localStorage.getItem('idToken');
    return axios.get(url2)
    .then((response)=>{
        console.log("response username", response.data.username);
        localStorage.setItem('username',response.data.username);
        return true;
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