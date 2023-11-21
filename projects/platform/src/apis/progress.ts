import { ProgressApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const progressApi = new ProgressApi(config, undefined, axios)

export default progressApi
