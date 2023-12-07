import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { defineStore } from 'pinia'
import digitalThreadApi from '@/apis/digitalThread'
import { useNotifyStore } from '@/stores/notify'
import type {
  ChangeDigitalThreadWorkflowStageRequest,
  DigitalThreadBase,
} from '@frontier/platform-web-sdk'
import { getBoldInterpolationMessageComponent } from '@/utils/render'
import useThreadBoardStore from '@/stores/threadBoard'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export interface WorkflowStageOption {
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
    const orgId = computed(() => store.getters['organization/orgId'])
    const threadBoardStore = useThreadBoardStore()
    const ogBaseDigitalThreadApi = useOgBaseApiWrapper(digitalThreadApi)

    const digitalThread = computed(
      () => store.getters['sticker/digitalThread'] as DigitalThreadBase
    )
    const workflowStageOptionList = ref<WorkflowStageOption[]>([])

    const getWorkflowStageOptionList = async () => {
      const res = await ogBaseDigitalThreadApi(
        'getDigitalThreadWorkflowStageOptions'
      )
      workflowStageOptionList.value = res.data.result!.workflowStageList.map(
        (w) => {
          if (w.isDefault) {
            return { ...w, workflowStageName: t('TT0135') }
          }
          return w
        }
      )
    }

    const getWorkflowStageNameById = (id: number) =>
      workflowStageOptionList.value.find((w) => w.workflowStageId === id)

    const changeDigitalThreadWorkflow = async (workflowStageId: number) => {
      const req: ChangeDigitalThreadWorkflowStageRequest = {
        orgId: orgId.value,
        digitalThreadSideId: digitalThread.value.digitalThreadSideId,
        workflowStageId,
      }

      await digitalThreadApi.changeDigitalThreadWorkflowStage(req)
      if (threadBoardStore.isActive) {
        threadBoardStore.fetchThreadBoard()
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
        messageComponent: getBoldInterpolationMessageComponent('TT0210', {
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
