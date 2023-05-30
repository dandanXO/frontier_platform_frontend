import { ThreadBoardApi, Configuration } from '@frontier/platform-web-sdk'
import axiosInstance from '@/apis'

const config = new Configuration({ basePath: '.' })

export const threadBoardApi = new ThreadBoardApi(
  config,
  undefined,
  axiosInstance
)

export default threadBoardApi
