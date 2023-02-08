import axios from '@/apis'
import type {
  DownloadLogPayload,
  EmbedPageLogPayload,
  ReceivePageLogPayload,
  ViewerLogPayload,
} from '@/types'

const dashboardApi = {
  createViewerLog: (payload: ViewerLogPayload) =>
    axios('/dashboard/viewer-log/create', {
      method: 'POST',
      data: payload,
    }),
  createDownloadLog: (payload: DownloadLogPayload) =>
    axios('/dashboard/download-log/create', {
      method: 'POST',
      data: payload,
    }),
  createReceivePageLog: (payload: ReceivePageLogPayload) =>
    axios('/dashboard/receive-page-log/create', {
      method: 'POST',
      data: payload,
    }),
  createEmbedPageLog: (payload: EmbedPageLogPayload) =>
    axios('/dashboard/embed-page-log/create', {
      method: 'POST',
      data: payload,
    }),
}

export default dashboardApi
