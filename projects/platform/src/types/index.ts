import type {
  OrgBookmark,
  FolderBookmark,
  WorkflowStage,
} from '@frontier/platform-web-sdk'
import type {
  CROP_MODE,
  U3M_CUT_SIDE,
  U3M_DOWNLOAD_PROP,
} from '@/utils/constants'
import type Decimal from 'decimal.js'

export interface DownloadU3mPayload {
  materialId: number
  url: string
  format: U3M_DOWNLOAD_PROP
}

export interface Image {
  width: number
  height: number
  src: string
}

export interface CropperConfig {
  image: Image
  dpi: number
  rotateDeg: number
  scaleRatio: number
  options: {
    x: number
    y: number
    width: number
    height: number
    initWidth: number
    initHeight: number
    imgWidth: number
    imgHeight: number
  }
}

export interface Side {
  sideName: U3M_CUT_SIDE
  config: CropperConfig
  rotateStart: number
}

export interface U3mSide extends Side {
  title: string
  cropMode: CROP_MODE
  scaleSizeInCm: number
  scaleStartInCm: number
  croppedImage: File | null
  perspectiveEditStatus: EditStatus
  perspectiveCropRecord?: PerspectiveCropRecord
  image: U3mImage
}

export interface Coord {
  x: number
  y: number
}

export interface SquareCropRecord extends Coord {
  rotateDeg: number
  scaleRatio: number
}

export interface PerspectiveCropPositions {
  leftTop: Coord
  leftBottom: Coord
  rightTop: Coord
  rightBottom: Coord
}

export interface PerspectiveCropRecord extends PerspectiveCropPositions {
  rotateDeg: number
}

export interface U3mCropRecord {
  squareCropRecord?: SquareCropRecord
  perspectiveCropRecord?: PerspectiveCropRecord
}

export interface ScannedImage {
  cropRecord?: SquareCropRecord
  dpi: number
}

export interface U3mImage {
  u3mCropRecord: U3mCropRecord
  dpi: number
}

export interface EditStatus {
  isSizeValid: boolean
  isDirectionValid: boolean
  isPositionsDirty: boolean
  isRotationDirty: boolean
}

export interface Dimension {
  dpi: number
  pixel: { width: number; height: number }
  cm: { width: Decimal; height: Decimal }
}

export interface WorkflowStageCreatePayload {
  workflowStageName: string
  digitalThreadList: DigitalThreadBase[]
}

export interface WorkflowStageRenamePayload {
  workflowStageId: number
  workflowStageName: string
}

export interface WorkflowStageMoveAllThreadsPayload {
  sourceWorkflowStageId: number
  targetWorkflowStageId: number
}

export interface WorkflowStageMenuItem {
  id: number
  name: string
  isDefault: boolean
}

export type WorkflowStageId = number | 'creatingWorkflowStage'

export interface CreatingGhostWorkflowStage
  extends Omit<WorkflowStage, 'workflowStageId'> {
  workflowStageId: 'creatingWorkflowStage'
}

export type BookmarkManagerBookmarkId = number | string

export interface BookmarkManagerOrgBookmark
  extends Omit<OrgBookmark, 'bookmarkId'> {
  bookmarkId: BookmarkManagerBookmarkId
}

export interface BookmarkManagerFolderBookmark
  extends Omit<FolderBookmark, 'bookmarkId'> {
  bookmarkId: BookmarkManagerBookmarkId
}

export type MakePropertiesRequired<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}
