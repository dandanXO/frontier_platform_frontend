import { NODE_LOCATION } from '@/utils/constants'

const NodePublishState = () => ({
  workspaceNodeId: null,
  workspaceNodeLocation: NODE_LOCATION.ORG,
  logo: '',
  displayName: '',
  publicDate: null,
  isCanClone: false,
  isCanDownloadU3M: false,
})

export default NodePublishState
