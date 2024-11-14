import axios, { AxiosInstance } from 'axios';

// Create a new Axios instance

const BASE_URL = 'https://d55a-2a09-bac5-404a-18c8-00-278-ca.ngrok-free.app/';
//const BASE_URL = 'http://localhost:8080/';
export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate=axios.create({
    baseURL: BASE_URL,
})
