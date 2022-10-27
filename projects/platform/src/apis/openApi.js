import Axios from 'axios'

const { VITE_APP_OPEN_API_ENDPOINT } = import.meta.env

const options = {
  baseURL: `${VITE_APP_OPEN_API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
}

const openApi = Axios.create(options)

openApi.interceptors.response.use(async (response) => {
  const { data, status } = response
  const { success } = data
  if (status === 200 && !success) return Promise.reject({ response })
  return response
})

export default {
  getMaterialByApiKey: ({ apiKey, frontierNo }) =>
    openApi.post(
      '/material/get',
      { frontierNo },
      { headers: { 'X-API-KEY': apiKey } }
    ),
  getMaterialByAccessToken: ({ accessToken, materialId }) =>
    openApi.post(
      '/viewer/get-material',
      { materialId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ),
}
