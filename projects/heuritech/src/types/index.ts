import type { U3M_DOWNLOAD_PROP } from '@/utils/constants'

export interface Clothes {
  clothesId: string
  title: string
  description: string
  clothesImageFileName: string
  mapAreaList: {
    color: string
    coords: string
  }[]
  materialList: {
    frontierNo: string
    imageUrl: string
    color: string
    isPublic: boolean
  }[]
}

export interface DownloadU3mPayload {
  materialId: number
  url: string
  format: U3M_DOWNLOAD_PROP
}
