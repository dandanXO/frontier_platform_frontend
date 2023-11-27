import { EmbedApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const embedApi = new EmbedApi(config, undefined, axios)

export default embedApi
