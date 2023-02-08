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
