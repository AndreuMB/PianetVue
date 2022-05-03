//axios configuration
import Axios from 'axios'
const instance  =  Axios.create({
baseURL: 'https://jsonplaceholder.typicode.com/users',
responseType: 'json',
timeout: 20000
})
const axios = instance;
export { axios }