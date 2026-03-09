import axios from 'axios'

// Axios instance for communicating with the backend API
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
})

export default api
