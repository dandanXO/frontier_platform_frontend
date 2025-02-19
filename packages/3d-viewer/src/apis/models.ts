import type {
  Material3DViewerGetModel200Response,
  Material3DViewerOrgGetAllModels200Response,
} from '@frontier/platform-web-sdk'
import axios from './index'

export default {
  getAllModels: (orgId: number) =>
    axios.post<Material3DViewerOrgGetAllModels200Response>(
      '/assets/material/3d-viewer/all-models',
      { orgId }
    ),
  getModel: (orgId: number, modelId: number) =>
    axios.post<Material3DViewerGetModel200Response>(
      '/assets/material/3d-viewer/get-model-url',
      { orgId, modelId }
    ),
}
