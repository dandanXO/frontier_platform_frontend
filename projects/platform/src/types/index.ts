import type { CROP_MODE, U3M_CUT_SIDE } from '@/utils/constants'
import type Decimal from 'decimal.js'

export interface Material {
  materialId: number
  materialNo: string
  frontierNo: string
  u3m: U3M
}

export interface U3M {
  status: number
  dpi: number
  u3mSpecUrl: string
  normalImgUrl: string
  roughImgUrl: string
  dispImgUrl: string
  zipUrl: string
  u3maUrl: string
  gltfUrl: string
}

export enum CATEGORY {
  U3M = 1,
  U3MA = 2,
  GLTF = 3,
}

export enum FROM_LOCATION_TYPE {
  PUBLIC_LIBRARY = 1,
  ASSET = 2,
  WORKSPACE = 3,
  MOODBOARD = 4,
  SHARED_WITH_ME = 5,
  SHARED_RECEIVE_PAGE = 6,
  EMBED = 7,
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

export interface DownloadLogPayload {
  materialId: number
  category: CATEGORY
  fromLocationType: FROM_LOCATION_TYPE
}

export interface EmbedPageLogPayload {
  sharingKey: string
}

export interface ReceivePageLogPayload {
  sharingKey: string
}

export interface ViewerLogPayload {
  materialId: number
  fromLocationType: FROM_LOCATION_TYPE
}
