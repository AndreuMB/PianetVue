import axios from 'axios'
import { getUsername } from './auth.service';
// const axios = require('axios').default;


export async function getSheet(){
    // let url2 = url+localStorage.getItem('sheet')+".json?auth="+localStorage.getItem('idToken');

    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    let url2 = url+localStorage.getItem('sheet')+".json";
    let sheet = await axios.get(url2)
    .then(async (response)=>{
        // console.log("response", response.data);
        return response.data;
    })
    console.log("views"+sheet.views);
    await sumView(sheet.views);

    return sheet;
}

export async function sumView(viewsSheet){
    // let url2 = url+localStorage.getItem('sheet')+".json?auth="+localStorage.getItem('idToken');

    viewsSheet = viewsSheet+1;
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    let url2 = url+localStorage.getItem('sheet')+".json";
    return axios.patch(url2, {views:viewsSheet})
    .then(async (response)=>{
        // console.log("response", response.data);
        return response.data;
    })
}

export async function createSheet(payload){
    let url="https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    let url2=url + ".json?auth="+localStorage.getItem('idToken');
    payload.author=localStorage.getItem("localId");
    payload.views=0;
    let new_id_sheet = await axios.post(url2,payload) // post create sheet id
    .then(async (response)=>{
        return response.data.name;
    })

    let id_sheets = await axios.get("https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/" // get existen sheets in user
    +localStorage.getItem('localId')+"/sheets.json?auth="+localStorage.getItem('idToken'))
    .then(async (response)=>{
        // console.log("sheets in user", response.data);
        return response.data;
    });

    // create array sheets user
    // console.log(id_sheets);
    if (id_sheets != null) {
        id_sheets.push(new_id_sheet);
    }else{
        id_sheets = [new_id_sheet];
    }
    
    url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    url2 = url+localStorage.getItem('localId')+".json?auth="+localStorage.getItem('idToken');
    axios.patch(url2,{sheets:id_sheets}) // put array sheet user
    .then(async (response)=>{
        // console.log("response in user", response);
        return response.data;
    });

    return new_id_sheet;


}

export async function saveSheet(sheetNotes, img, title=""){
    let sheet_id = localStorage.getItem("sheet");
    let user_id = localStorage.getItem("localId");
    let username = await getUsername(user_id);

    // let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/"
    // +localStorage.getItem('localId')+"/sheets/";
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    let url2 = url+sheet_id+".json?auth="+localStorage.getItem('idToken');
    // console.log("url2 = " + url2);
    // console.log("date now = "+Date.now());
    let request;
    if (title == "") {
        request = axios.patch(url2,{"sheetNotes" : sheetNotes, "img" : img, "date":Date.now(), "author": username})
        .then(async (response)=>{
            return response.data;
        });
    }else{
        request = axios.patch(url2,{"sheetNotes" : sheetNotes, "img" : img, "date":Date.now(), "title" : title, "author": username})
        .then(async (response)=>{
            return response.data;
        })
    }

    return request;

}

export async function getAllSheets(){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    let url2 = url+localStorage.getItem('localId')+"/sheets.json?auth="+localStorage.getItem('idToken');

    let id_sheets =  await axios.get(url2) // user sheets
    .then(async (response)=>{          
        return response.data;
    });

    console.log("is_sheets",id_sheets);

    url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    url2 = url+".json?auth="+localStorage.getItem('idToken');

    if (id_sheets != null) {
        console.log("enter id_sheets");
        return axios.get(url2)
        .then(async (response)=>{
            // console.log("response sheets_firebase",response);
            // console.log("response retutn",response);
            let sheets={};
            id_sheets.forEach(element => {
                // console.log(element);
                // console.log(response.data[element]);
                sheets[element]=response.data[element];
                // sheets=response.data[element];
            });
            // console.log("data sheests",sheets);


            for (const [key, value] of Object.entries(sheets)) {
                sheets[key].id=key
            }


            return sheets;
        });
    }

    return null;

    // return "";
}

export async function getHomeSheets(){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    let url2 = url+".json";

    return axios.get(url2) // user sheets
    .then(async (response)=>{ 
        for (const [key, value] of Object.entries(response.data)) {
            response.data[key].id=key
        }         
        return response.data;
    });
}

export async function deleteSheet(payload){
    let url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/sheets/";
    let url2 = url+payload+".json?auth="+localStorage.getItem('idToken');
    axios.delete(url2)
    .then(async (response)=>{
        // console.log("response", response.data);
        return response.data;
    })

    let id_sheets = await axios.get("https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/" // get existen sheets in user
    +localStorage.getItem('localId')+"/sheets.json?auth="+localStorage.getItem('idToken'))
    .then(async (response)=>{
        // console.log("sheets in user", response.data);
        return response.data;
    });

    // console.log("payload",payload);
    id_sheets = arrayRemove(id_sheets, payload);

    // create array sheets user
    // console.log("id_sheets", id_sheets);
    // if (id_sheets != null) {
    //     id_sheets.push(new_id_sheet);
    // }else{
    //     id_sheets = [new_id_sheet];
    // }
    
    url = "https://daw2022-64f58-default-rtdb.europe-west1.firebasedatabase.app/users/";
    url2 = url+localStorage.getItem('localId')+".json?auth="+localStorage.getItem('idToken');
    await axios.patch(url2,{sheets:id_sheets}) // put array sheet user
    .then(async (response)=>{
        console.log("response in user", response);
        return response.data;
    });

    return "DONE";

    function arrayRemove(arr, value) {
 
        return arr.filter(function(geeks){
            return geeks != value;
        });
      
     }


}