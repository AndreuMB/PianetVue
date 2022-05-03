import {axios} from 'axios'

export const signIn = async (url, payload) => {
   return axios.post('login ',payload)
   .then(({data}) => {
        return Promise.resolve(data)
   })
   .catch((err) => {
       return Promise.reject(err)
   })
}

// registerAuth(dataJSON:{}):Observable<{}>{
//     // let datos = { ...dataJSON, returnSecureToken: true };
//     let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCFfIeHfupYXw89FUOMeorhfQrndz7iIck";
//     return this.http.post<{idToken:string, localId:string}>(url,JSON.stringify(dataJSON))
//     .pipe(
//       map(response => {
//         console.log("response", response);
//         localStorage.setItem('idToken',response.idToken);
//         localStorage.setItem('localId',response.localId);
//         return response;
//       })
//     );
//   }