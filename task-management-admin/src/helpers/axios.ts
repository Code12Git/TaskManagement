import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api'
const token = localStorage.getItem('token')?.replace(/"/g, '');

export const publicRequest = axios.create({
    baseURL: BASE_URL
})
export const privateRequest = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})