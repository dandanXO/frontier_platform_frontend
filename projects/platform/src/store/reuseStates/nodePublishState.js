import { OG_TYPE } from '@/utils/constants'

const NodePublishState = () => ({
  workspaceNodeId: null,
  workspaceNodeLocation: OG_TYPE.ORG,
  logo: '',
  displayName: '',
  publicDate: null,
  isCanClone: false,
  isCanDownloadU3M: false,
})

export default NodePublishState
