import { MoodboardApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const moodboardApi = new MoodboardApi(config, undefined, axios)

export default moodboardApi
