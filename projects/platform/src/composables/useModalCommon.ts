import { ref } from 'vue'

import { TYPE as ALERT_TYPE } from '@frontier/ui-component/src/FNotify/FAlert/FAlert.vue'
import type { Props as AlertProps } from '@frontier/ui-component/src/FNotify/FAlert/FAlert.vue'

const isShowAlert = ref(false)
const alertProps = ref<AlertProps>({
  type: ALERT_TYPE.INFO,
})

const useModalCommon = () => {
  const showAlert = (props: AlertProps) => {
    alertProps.value = props
    isShowAlert.value = true
  }
  const closeAlert = () => {
    isShowAlert.value = false
  }
  return {
    isShowAlert,
    alertProps,
    showAlert,
    closeAlert,
  }
}

export default useModalCommon
