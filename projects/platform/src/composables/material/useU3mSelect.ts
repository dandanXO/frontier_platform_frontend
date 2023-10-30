import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const useU3mSelect = () => {
  const hasPhysicalDataInitialValue = false
  const needToGeneratePhysicalInitialValue = true

  const u3mFile = ref<File | null>(null)
  const hasPhysicalData = ref(hasPhysicalDataInitialValue)
  const needToGeneratePhysical = ref(needToGeneratePhysicalInitialValue)

  const store = useStore()

  const hasUploadedU3mFile = computed(() => u3mFile.value !== null)
  const hasU3mQuota = computed(() => store.getters['polling/hasU3mQuota'])

  const openModalUploadU3mFile = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-u3m-file',
      properties: {
        uploadedHandler: (payload: {
          u3mFile: File
          hasPhysicalData: boolean
        }) => {
          u3mFile.value = payload.u3mFile
          hasPhysicalData.value = payload.hasPhysicalData

          if (hasPhysicalData.value) {
            needToGeneratePhysical.value = false
          }
        },
      },
    })
  }

  const removeU3mFile = () => {
    u3mFile.value = null
    hasPhysicalData.value = hasPhysicalDataInitialValue
    needToGeneratePhysical.value = needToGeneratePhysicalInitialValue
  }

  return {
    u3mFile,
    hasPhysicalData,
    needToGeneratePhysical,
    hasUploadedU3mFile,
    hasU3mQuota,
    openModalUploadU3mFile,
    removeU3mFile,
  }
}

export default useU3mSelect
