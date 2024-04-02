import { ShareToMeApi, Configuration } from '@frontier/platform-web-sdk'
import axiosInstance from '@/apis'

const config = new Configuration({ basePath: '.' })

export const shareWithMeApi = new ShareToMeApi(config, undefined, axiosInstance)

export default shareWithMeApi
