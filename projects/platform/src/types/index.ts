import type {
  OrgBookmark,
  FolderBookmark,
  WorkflowStage,
  CropAssetsMaterialMultimediaRequestAllOfCroppedImage,
} from '@frontier/platform-web-sdk'
import type { CROP_MODE, EXTENSION, U3M_CUT_SIDE } from '@/utils/constants'
import type Decimal from 'decimal.js'
import type useMaterialForm from '@/composables/material/useMaterialForm'
import type useU3mSelect from '@/composables/material/useU3mSelect'
import type useAttachmentCreate from '@/composables/material/useAttachmentCreate'
import type useMultimediaCreate from '@/composables/material/useMultimediaCreate'
import type useAttachmentUpdate from '@/composables/material/useAttachmentUpdate'
import type useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'

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

export interface FunctionOption<Type, Id = number> {
  id: Id
  name: (n?: Type | Type[]) => string
  func: (n: Type | Type[]) => any
  icon?: (n?: Type | Type[]) => string
  disabled?: (n: Type | Type[]) => boolean
}

export type MaterialFormService = ReturnType<typeof useMaterialForm>
export type MaterialU3mCreateService = ReturnType<typeof useU3mSelect>
export type MaterialU3mUpdateService = ReturnType<typeof useU3mSelect>
export type MaterialMultimediaCreateService = ReturnType<
  typeof useMultimediaCreate
>
export type MaterialMultimediaUpdateService = ReturnType<
  typeof useMultimediaUpdate
>
export type MaterialAttachmentCreateService = ReturnType<
  typeof useAttachmentCreate
>
export type MaterialAttachmentUpdateService = ReturnType<
  typeof useAttachmentUpdate
>

export interface AttachmentCreateItem {
  id: string
  file: File
  originalUrl: string
  thumbnailUrl: string
  displayFileName: string
  extension: EXTENSION
  displayFileNameExcludeExtension: string
}

export interface MultimediaCreateItem {
  id: string
  file: File
  originalUrl: string
  thumbnailUrl: string
  displayFileName: string
  extension: EXTENSION
  displayFileNameExcludeExtension: string
  isCover: boolean
  croppedImage: CropAssetsMaterialMultimediaRequestAllOfCroppedImage | null
}
