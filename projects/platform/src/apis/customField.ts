import { CustomFieldApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const customFieldApi = new CustomFieldApi(config, undefined, axios)

export default customFieldApi
