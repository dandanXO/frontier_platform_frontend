import { ReceivedShareApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const receivedShareApi = new ReceivedShareApi(config, undefined, axios)

export default receivedShareApi
