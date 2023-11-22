import { ShowroomApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
export const showroomApi = new ShowroomApi(config, undefined, axios)

export default showroomApi
