import { SearchApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const searchApi = new SearchApi(config, undefined, axios)

export default searchApi
