import { DashboardApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const dashboardApi = new DashboardApi(config, undefined, axios)

export default dashboardApi
