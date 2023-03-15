import Axios from 'axios'

const { VITE_APP_API_ENDPOINT } = import.meta.env

const options = {
  baseURL: `${VITE_APP_API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
}

const instance = Axios.create(options)

export default instance
