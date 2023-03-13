import { SHARING_FROM, OG_TYPE, NODE_TYPE } from '@/utils/constants'

const NodeShareState = () => ({
  sharingId: null,
  sharingKey: null,
  sharingFrom: SHARING_FROM.WORKSPACE,
  workspaceNodeId: '',
  workspaceNodeType: NODE_TYPE.COLLECTION,
  workspaceNodeLocation: OG_TYPE.ORG,
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
