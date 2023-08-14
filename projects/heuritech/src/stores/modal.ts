import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MODAL_TYPE } from '@/utils/constants'

interface ModalPipelineItem {
  type: MODAL_TYPE
  options: unknown
}

export const useModalStore = defineStore('modal', () => {
  const modalPipeline = ref<ModalPipelineItem[]>([])

  const openModalConfirm = (options: unknown) => {
    closePipeline()
    modalPipeline.value.push({ type: MODAL_TYPE.CONFIRM, options })
  }

  const openModal = (options: unknown) => {
    closePipeline()
    modalPipeline.value.push({ type: MODAL_TYPE.MODAL, options })
  }

  const openModalBehavior = (options: unknown) => {
    closePipeline()
    modalPipeline.value.push({ type: MODAL_TYPE.BEHAVIOR, options })
  }

  const closePipeline = () => modalPipeline.value.pop()

  const clearPipeline = () => (modalPipeline.value.length = 0)

  return {
    modalPipeline,
    openModalConfirm,
    openModal,
    openModalBehavior,
    closePipeline,
    clearPipeline,
  }
})
