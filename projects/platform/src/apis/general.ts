import { GeneralApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const generalApi = new GeneralApi(config, undefined, axios)

export default generalApi
