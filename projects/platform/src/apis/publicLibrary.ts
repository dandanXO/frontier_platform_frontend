import { PublicLibraryApi, Configuration } from '@frontier/platform-web-sdk'
import axios from '@/apis'

const config = new Configuration({ basePath: '.' })
const publicLibraryApi = new PublicLibraryApi(config, undefined, axios)

export default publicLibraryApi
