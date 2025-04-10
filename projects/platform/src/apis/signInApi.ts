import { SignInApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const signInApi = new SignInApi(config, undefined, axios)

export default signInApi
