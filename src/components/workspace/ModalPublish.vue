<template lang="pug">
div(class="w-101 px-8")
  h6(class="font-bold text-h6 text-primary pb-7.5 text-center") {{$t('FF0028')}}
  input-radio-group(
    :label="$t('FF0029')"
    :optionList="optionIsPublic"
    v-model:inputValue="params.isPublic"
    class="mb-7.5"
  )
  input-container(:label="$t('FF0032')")
    div(class="flex gap-x-3")
      input-checkbox(
        binary
        v-model:inputValue="params.isCanDownloadU3M"
        :label="$t('FF0033')"
      )
      input-checkbox(
        binary
        v-model:inputValue="params.isCanClone"
        :label="$t('FF0034')"
      )
  btn-group(
    class="h-25"
    :primaryText="$t('UU0018')"
    @click:primary="publishNode"
    :secondaryButton="false"
  )
</template>

<script>
import { useI18n } from 'vue-i18n'
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalPublish',
  props: {
    workspaceNode: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const { workspaceNode } = toRefs(props)
    const optionIsPublic = [
      {
        name: t('FF0030'),
        value: true
      },
      {
        name: t('FF0031'),
        value: false
      }
    ]

    const params = reactive({
      isPublic: workspaceNode.value.isPublic,
      isCanDownloadU3M: workspaceNode.value.isCanClone,
      isCanClone: workspaceNode.value.isCanDownloadU3M
    })

    const publishNode = async () => {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('workspace/publishNode', { workspaceNodeId: workspaceNode.value.workspaceNodeId, ...params })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/reloadInnerApp')
      store.commit('helper/PUSH_message', t('FF0035'))
    }

    return {
      optionIsPublic,
      params,
      publishNode
    }
  }
}
</script>
