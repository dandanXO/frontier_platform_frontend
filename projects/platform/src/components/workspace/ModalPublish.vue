<template lang="pug">
modal-behavior(
  :header="$t('FF0028')"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="publishNode"
  @click:secondary="closeModal"
)
  div(class="w-91")
    f-input-radio-group(
      :label="$t('FF0029')"
      :optionList="optionIsPublic"
      v-model:inputValue="params.isPublic"
      class="mb-7.5"
    )
    f-input-container(:label="$t('FF0032')")
      div(class="flex gap-x-3")
        f-input-checkbox(
          binary
          v-model:inputValue="params.isCanDownloadU3M"
          :label="$t('FF0033')"
          :disabled="!params.isPublic"
        )
        f-input-checkbox(
          binary
          v-model:inputValue="params.isCanClone"
          :label="$t('FF0034')"
          :disabled="!params.isPublic"
        )
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'

const props = defineProps({
  workspaceNode: {
    type: Object,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { workspaceNode } = toRefs(props)
const optionIsPublic = [
  {
    name: t('FF0030'),
    value: true,
  },
  {
    name: t('FF0031'),
    value: false,
  },
]

const params = reactive({
  isPublic: workspaceNode.value.isPublic,
  isCanDownloadU3M: workspaceNode.value.isCanDownloadU3M,
  isCanClone: workspaceNode.value.isCanClone,
})

const publishNode = async () => {
  store.dispatch('helper/openModalLoading')
  await store.dispatch('workspace/publishNode', {
    ...params,
    workspaceNodeId: workspaceNode.value.workspaceNodeId,
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('FF0035') })
}

const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>
