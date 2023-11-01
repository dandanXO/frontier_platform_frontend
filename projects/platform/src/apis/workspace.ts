import { WorkspaceApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const workspaceApi = new WorkspaceApi(config, undefined, axios)

export default workspaceApi
