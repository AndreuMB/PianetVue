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
    .then((response)=>{
        console.log("response", response);
        localStorage.setItem('idToken',response.idToken);
        localStorage.setItem('localId',response.localId);
    })
}

function logout(){
    localStorage.removeItem('idToken');
    localStorage.removeItem('localId');
    localStorage.removeItem("idSheet");
}