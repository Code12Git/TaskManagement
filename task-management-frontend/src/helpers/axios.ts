import axios from 'axios'

const BASE_URL = 'https://taskmanagement-mvcu.onrender.com/api'
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

export const formRequest = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "multipart/form-data",
		Authorization: `Bearer ${token}`,
	},
});