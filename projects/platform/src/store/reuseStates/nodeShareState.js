import { SHARING_FROM, NODE_LOCATION, NODE_TYPE } from '@/utils/constants'

const NodeShareState = () => ({
  sharingId: null,
  sharingKey: null,
  sharingFrom: SHARING_FROM.WORKSPACE,
  workspaceNodeId: '',
  workspaceNodeType: NODE_TYPE.COLLECTION,
  workspaceNodeLocation: NODE_LOCATION.ORG,
  message: '',
  logo: '',
  displayName: '',
  shareDate: null,
  isCanClone: false,
  isCanDownloadU3M: false,
  isClosed: false,
  isCanSave: false,
  isSourceOrgHasMade2FlowPlan: false,
})

export default NodeShareState
