import type {
  OrgBookmark,
  FolderBookmark,
  WorkflowStage,
  CropImageRecord,
  Extension,
  Material,
  MaterialCreate,
  DigitalThreadBase,
} from '@frontier/platform-web-sdk'
import type { CROP_MODE, U3M_CUT_SIDE } from '@/utils/constants'
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
  image?: Image
  dpi?: number
  rotateDeg?: number
  scaleRatio?: number
  options?: {
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
  isQuilting?: boolean
  scaleSizeInCm: number
  scaleStartInCm: number
  croppedImage: File | null
  perspectiveEditStatus: EditStatus
  perspectiveCropRecord?: PerspectiveCropRecord | null
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
  squareCropRecord?: SquareCropRecord | null
  perspectiveCropRecord?: PerspectiveCropRecord | null
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
  testId?: string
}

export type MaterialFormService = ReturnType<typeof useMaterialForm>
export type MaterialU3mSelectService = ReturnType<typeof useU3mSelect>
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
  displayUrl: string
  thumbnailUrl: string
  displayFileName: string
  extension: Extension
  displayFileNameExcludeExtension: string
}

export interface MultimediaCreateItem {
  id: string
  file: File
  originalUrl: string
  displayUrl: string
  thumbnailUrl: string
  displayFileName: string
  extension: Extension
  displayFileNameExcludeExtension: string
  isCover: boolean
  // croppedImage: CropAssetsMaterialMultimediaRequestAllOfCroppedImage | null
  croppedImage: File | null
  cropRecord: CropImageRecord | null
}

export type CoverId = 'faceSide' | 'backSide' | 'digitalDrape' | number

export type MaterialFileId =
  | 'cover'
  | 'faceSide'
  | 'faceSideRuler'
  | 'backSide'
  | 'backSideRuler'
  | 'digitalDrape'
  | number

export interface MaterialFile {
  id: MaterialFileId
  fileId: number | null
  displayUrl: string | null
  originalUrl: string | null
  thumbnailUrl: string | null
  displayName: string
  displayNameShort: string
  isLowDpi?: boolean
  caption: string | null
  extension: Extension
}

export type MaterialViewModeFile = {
  id: MaterialFileId | string
  originalUrl: string
  displayUrl: string
  thumbnailUrl: string | null
  displayName: string
  extension: Extension
}

export interface MaterialRow extends MaterialCreate {
  isCreate: boolean
  isDelete: boolean
  isDirty: boolean
  editable: boolean
}

export interface SubmitPayload {
  createList: Material[]
  updateList: Material[]
  deleteList: Material[]
}

export interface AddonsService {
  id: string
  planStatus: {
    INVALID: boolean
    ACTIVATE: boolean
  }
  logo: string
  projectName: string
  planName: string
  status: number
  renewDate: string
  providerName: string
  completeQty: number
  totalQty: number
  unFilledCertificationQty: number
}
