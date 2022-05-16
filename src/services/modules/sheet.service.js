import axios from 'axios'
// const axios = require('axios').default;


export async function getSheet(){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let url2 = url+localStorage.getItem('localId')+"/sheets/"+localStorage.getItem('sheet')+".json?auth="+localStorage.getItem('idToken');
    return axios.get(url2)
    .then(async (response)=>{
        console.log("response", response.data);
        return response.data;
    })
}

export async function createSheet(payload){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let url2 = url+localStorage.getItem('localId')+"/sheets.json?auth="+localStorage.getItem('idToken');
    return axios.post(url2,payload)
    .then(async (response)=>{
        console.log("response", response.data);
        return response.data;
    })
}

export async function saveSheet(sheetNotes, img, title=""){
    let sheet_id = localStorage.getItem("sheet");
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/"
    +localStorage.getItem('localId')+"/sheets/";
    let url2 = url+sheet_id+".json?auth="+localStorage.getItem('idToken');
    console.log("url2 = " + url2);
    console.log("date now = "+Date.now());
    let request;
    if (title == "") {
        request = axios.patch(url2,{"sheetNotes" : sheetNotes, "img" : img, "date":Date.now()})
        .then(async (response)=>{
            return response.data;
        });
    }else{
        axios.patch(url2,{"sheetNotes" : sheetNotes, "img" : img, "date":Date.now(), "title" : title})
        .then(async (response)=>{
            return response.data;
        })
    }

    return request;

}

export async function getAllSheets(){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    console.log("localId = " +localStorage.getItem('localId'));
    
    let url2 = url+localStorage.getItem('localId')+"/sheets.json?auth="+localStorage.getItem('idToken');
    return axios.get(url2)
    .then(async (response)=>{

        if (response.data) {
            for (const [key, value] of Object.entries(response.data)) {
                response.data[key].id=key
            }
    
        }


        console.log(response.data);
          
        return response.data;
    })
}

export async function deleteSheet(payload){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/"
    +localStorage.getItem('localId')+"/sheets/";
    let url2 = url+payload+".json?auth="+localStorage.getItem('idToken');
    return axios.delete(url2)
    .then(async (response)=>{
        console.log("response", response.data);
        return response.data;
    })
}