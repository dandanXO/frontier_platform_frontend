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

    const digitalThread = computed(
      () => store.getters['sticker/digitalThread'] as DigitalThreadBase
    )
    const workflowStageOptions = ref<WorkflowStageOption[]>([])

    const getWorkflowStageOptions = async () => {
      const req: GetDigitalThreadWorkflowStageOptionsRequest = {
        orgId: unit.value.orgId,
        ogId: unit.value.ogId,
        ogType: unit.value.ogType,
      }
      const res = await digitalThreadApi.getDigitalThreadWorkflowStageOptions(
        req
      )
      workflowStageOptions.value = res.data.result!.workflowStageList
    }

    const getWorkflowStageNameById = (id: number) =>
      workflowStageOptions.value.find((w) => w.workflowStageId === id)

    const changeDigitalThreadWorkflow = async (workflowStageId: number) => {
      const req: ChangeDigitalThreadWorkflowStageRequest = {
        orgId: unit.value.orgId,
        digitalThreadSideId: digitalThread.value.digitalThreadSideId,
        workflowStageId,
      }

      await digitalThreadApi.changeDigitalThreadWorkflowStage(req)
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
      workflowStageOptions,
      getWorkflowStageOptions,
      getWorkflowStageNameById,
      changeDigitalThreadWorkflow,
    }
  }
)

export default useDigitalThreadWorkflowStageStore
