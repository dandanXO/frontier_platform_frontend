import dashboardApi from '@/apis/dashboard'

export default {
  namespaced: true,
  actions: {
    createViewerLog(_, payload) {
      return dashboardApi.createViewerLog(payload)
    },
    createDownloadLog(_, payload) {
      return dashboardApi.createDownloadLog(payload)
    },
    createReceivePageLog(_, payload) {
      return dashboardApi.createReceivePageLog(payload)
    },
    createEmbedPageLog(_, payload) {
      return dashboardApi.createEmbedPageLog(payload)
    },
  },
}
