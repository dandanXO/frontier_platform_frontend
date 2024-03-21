<template lang="pug">
modal-behavior(
  :header="type === SHARE_WITH_TYPE.OG ? $t('RR0344') : $t('RR0155')"
  :primaryBtnText="$t('RR0079')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="targetList.length === 0"
  @click:primary="assignedShare"
  @click:secondary="closeModal"
)
  div(class="w-104.5")
    share-input-list(
      :type="type"
      v-model:inputShareList="targetList"
      @addNew="($event) => targetList.push($event)"
      :placeholder="type === SHARE_WITH_TYPE.OG ? $t('FF0076') : $t('RR0350')"
      :callbackGetTarget="getTarget"
    )
      template(#default="{ item, index, removeTarget }")
        template(v-if="type === SHARE_WITH_TYPE.OG")
          f-avatar(type="org" :imageUrl="item.unitLogo" size="md")
          p(class="text-body2 flex-grow text-grey-900 line-clamp-1") {{ item.unitName }}
        template(v-else-if="type === SHARE_WITH_TYPE.USER")
          f-avatar(
            v-if="item.isFrontierUser"
            type="user"
            :imageUrl="item.avatar"
            size="md"
          ) 
          div(v-else class="w-8 h-8 rounded-full border-grey-900 border border-dashed")
          p(class="text-body2 flex-grow text-grey-900 line-clamp-1") {{ item.email }}
        f-svg-icon(
          iconName="close"
          size="24"
          class="text-grey-600 hover:text-primary-400 cursor-pointer"
          @click="removeTarget(index)"
        ) {{ $t('FF0060') }}
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import ShareInputList from '@/components/common/ShareInputList.vue'
import { usePublicLibraryStore } from '@/stores/publicLibrary'
import type {
  ShareOGTarget,
  ShareEmailTarget,
} from '@frontier/platform-web-sdk'
import { SHARE_WITH_TYPE } from '@/utils/constants'

const props = defineProps<{
  nodeId: number
  type: SHARE_WITH_TYPE
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBasePublicLibraryApi } = usePublicLibraryStore()
const targetList = ref<ShareOGTarget[] | ShareEmailTarget[]>([])

const getTarget = async (targetNumber: string) => {
  if (props.type === SHARE_WITH_TYPE.OG) {
    const { data } = await ogBasePublicLibraryApi(
      'getpublicLibraryNodeShareAddPeopleOGGetTarget',
      {
        nodeId: props.nodeId,
        ogNo: targetNumber,
      }
    )
    return data.result.target
  } else {
    const { data } = await ogBasePublicLibraryApi(
      'getpublicLibraryNodeShareAddPeopleEmailGetTarget',
      {
        nodeId: props.nodeId,
        email: targetNumber,
      }
    )
    return data.result.target
  }
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  if (props.type === SHARE_WITH_TYPE.OG) {
    await ogBasePublicLibraryApi('sharePublicLibraryNodeShareAddPeopleOG', {
      nodeId: props.nodeId,
      targetList: targetList.value as ShareOGTarget[],
    })
  } else {
    await ogBasePublicLibraryApi('sharePublicLibraryNodeShareAddPeopleEmail', {
      nodeId: props.nodeId,
      targetList: targetList.value as ShareEmailTarget[],
    })
  }
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  notify.showNotifySnackbar({ messageText: t('RR0157') })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
