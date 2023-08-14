import Axios from 'axios'
const { VITE_APP_OPEN_API_ENDPOINT, VITE_APP_X_API_KEY } = import.meta.env

const options = {
  baseURL: `${VITE_APP_OPEN_API_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': VITE_APP_X_API_KEY,
  },
  timeout: 30000,
}

const instance = Axios.create(options)

export default instance

const fetchMaterialList = (path: string, keyword: string) =>
  instance(path, {
    method: 'POST',
    data: {
      keyword,
      pagination: {
        isShowMatch: false,
        perPageCount: 40,
        targetPage: 1,
      },
      filter: null,
    },
  })

const fetchMaterialListFromAssets = (keyword: string) =>
  fetchMaterialList('/search/asset', keyword)
const fetchMaterialListFromPublic = (keyword: string) =>
  fetchMaterialList('/search/public', keyword)

const getMaterial = (frontierNo: string) =>
  instance('/huritech/material/get', {
    method: 'POST',
    data: {
      frontierNo,
    },
  })

export { fetchMaterialListFromAssets, fetchMaterialListFromPublic, getMaterial }
