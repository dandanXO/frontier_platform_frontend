import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { defineStore } from 'pinia'
import useCurrentUnit from '@/composables/useCurrentUnit'
import digitalThreadApi from '@/apis/digitalThread'
import { useNotifyStore } from '@/stores/notify'
import type {
  ChangeDigitalThreadWorkflowStageRequest,
  DigitalThreadBase,
  GetDigitalThreadWorkflowStageOptionsRequest,
} from '@frontier/platform-web-sdk'
import useThreadBoardStore from './threadBoard'

interface WorkflowStageOption {
  workflowStageId: number
  workflowStageName: string
  isDefault: boolean
}

const useDigitalThreadWorkflowStageStore = defineStore(
  'digitalThreadWorkflowStage',
  () => {
    const { t } = useI18n()
    const store = useStore()
    const notify = useNotifyStore()
    const { unit } = useCurrentUnit()
    const threadBoardStore = useThreadBoardStore()

    const digitalThread = computed(
      () => store.getters['sticker/digitalThread'] as DigitalThreadBase
    )
    const workflowStageOptionList = ref<WorkflowStageOption[]>([])

    const getWorkflowStageOptionList = async () => {
      const req: GetDigitalThreadWorkflowStageOptionsRequest = {
        orgId: unit.value.orgId,
        ogId: unit.value.ogId,
        ogType: unit.value.ogType,
      }
      const res = await digitalThreadApi.getDigitalThreadWorkflowStageOptions(
        req
      )
      workflowStageOptionList.value = res.data.result!.workflowStageList
    }

    const getWorkflowStageNameById = (id: number) =>
      workflowStageOptionList.value.find((w) => w.workflowStageId === id)

    const changeDigitalThreadWorkflow = async (workflowStageId: number) => {
      const req: ChangeDigitalThreadWorkflowStageRequest = {
        orgId: unit.value.orgId,
        digitalThreadSideId: digitalThread.value.digitalThreadSideId,
        workflowStageId,
      }

      await digitalThreadApi.changeDigitalThreadWorkflowStage(req)
      if (threadBoardStore.isActive) {
        threadBoardStore.getThreadBoard()
      }

      store.dispatch('sticker/getDigitalThread', {
        digitalThreadSideId: digitalThread.value.digitalThreadSideId,
      })

      const oldWorkflowStage = getWorkflowStageNameById(
        digitalThread.value.workflowStageId
      )
      const newWorkflowStage = getWorkflowStageNameById(workflowStageId)

      if (!oldWorkflowStage || !newWorkflowStage) {
        throw new Error('workflow stage not exist')
      }

      notify.showNotifySnackbar({
        isShowSnackbar: true,
        messageText: t('TT0210', {
          lastStage: oldWorkflowStage.workflowStageName,
          newStage: newWorkflowStage.workflowStageName,
        }),
      })
    }

    return {
      workflowStageOptionList,
      getWorkflowStageOptionList,
      getWorkflowStageNameById,
      changeDigitalThreadWorkflow,
    }
  }
)

export default useDigitalThreadWorkflowStageStore
