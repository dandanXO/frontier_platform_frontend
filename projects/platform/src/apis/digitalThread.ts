import { DigitalThreadApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const digitalThreadApi = new DigitalThreadApi(config, undefined, axios)

export default digitalThreadApi
