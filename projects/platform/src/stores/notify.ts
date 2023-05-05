import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  NotifyBannerProps,
  NotifySnackbarProps,
} from '@frontier/ui-component/src/FNotify'

export const useNotifyStore = defineStore('notify', () => {
  /**
   * Banner
   */
  const isShowNotifyBanner = ref<boolean>(false)
  const notifyBannerProps = ref<NotifyBannerProps>()
  const showNotifyBanner = (props: NotifyBannerProps) => {
    isShowNotifyBanner.value = true
    notifyBannerProps.value = props
  }
  const closeNotifyBanner = () => {
    isShowNotifyBanner.value = false
    notifyBannerProps.value = undefined
  }

  /**
   * Snackbar
   */
  const notifySnackbarProps = ref<NotifySnackbarProps>({
    isShowSnackbar: false,
  })
  const showNotifySnackbar = (props: NotifySnackbarProps) => {
    notifySnackbarProps.value = {
      ...props,
      id: Date.now(),
      isShowSnackbar: true,
    }
  }
  const closeNotifySnackbar = () => {
    notifySnackbarProps.value = {
      isShowSnackbar: false,
    }
  }

  return {
    // Banner
    isShowNotifyBanner,
    notifyBannerProps,
    showNotifyBanner,
    closeNotifyBanner,
    // Snackbar
    notifySnackbarProps,
    showNotifySnackbar,
    closeNotifySnackbar,
  }
})
