import { AssetsApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const assetsApi = new AssetsApi(config, undefined, axios)

export default assetsApi
