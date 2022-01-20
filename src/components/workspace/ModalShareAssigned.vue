<template lang="pug">
div(class="w-213.5 px-8")
  h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{$t('RR0155')}}
  div(class="h-72.5 mb-4.5 grid grid-cols-2 gap-x-7.5")
    div
      input-text-icon(
        v-model:textValue="target"
        prependIcon="search"
        :label="$t('RR0156')"
        :placeholder="$t('RR0150')"
        :disabledIcon="target === ''"
        :customErrorMsg="errorMsg"
        @click:icon="addToTargetList"
        class="mb-5"
      )
      overlay-scrollbar-container(class="h-51")
        div(class="grid gap-y-5")
          div(v-for="(item, index) in targetList" class="flex items-center gap-x-3")
            img(v-if="item.logo" :src="item.logo" class="w-9 h-9 rounded-full")
            div(v-else class="w-9 h-9 rounded-full border-black-500 border border-dashed")
            div(class="text-body2 flex-grow")
              p(class="text-primary line-clamp-1") {{item.name}}
              p(v-if="item.number" class="text-black-500") {{item.number}}
            p(class="text-body2 text-black-500 pr-2.5 cursor-pointer" @click="removeTarget(index)") {{$t('FF0060')}}
    div
      input-container(:label="$t('FF0032')" class="pb-5")
        input-checkbox(
          binary
          v-model:inputValue="formData.isCanDownloadU3M"
          :label="$t('FF0033')"
          class="pb-2.5"
          size="20"
        )
        input-checkbox(
          binary
          v-model:inputValue="formData.isCanClone"
          :label="$t('FF0034')"
          size="20"
        )
      input-textarea(
        v-model:textValue="formData.messages"
        :label="$t('RR0146')"
        height="174"
        :customErrorMsg="formData.messages.length > 1000 ? $t('WW0073') : ''"
      )
  btn-group(
    class="h-25"
    :primaryText="$t('RR0079')"
    :primaryButtonDisabled="targetList.length === 0 || formData.messages.length > 1000"
    :secondaryButton="false"
    @click:primary="assignedShare"
  )
</template>

<script>
import { ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalShareAssigned',
  props: {
    workspaceNodeId: {
      type: [String, Number],
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()

    const target = ref('')
    const formData = reactive({
      isCanClone: false,
      isCanDownloadU3M: false,
      messages: ''
    })
    const errorMsg = ref('')
    const targetList = ref([])

    const addToTargetList = async () => {
      try {
        const frozenTargetValue = target.value.trim()
        const existedTarget = targetList.value.find(({ name, number }) => name === frozenTargetValue || number === frozenTargetValue)
        if (existedTarget) {
          switch (existedTarget.type) {
            case 1:
              throw t('WW0058')
            case 2:
              throw t('WW0059')
            case 3:
              throw t('WW0057')
          }
        }

        const temp = await store.dispatch('workspace/getShareTarget', { workspaceNodeId: props.workspaceNodeId, target: frozenTargetValue })
        targetList.value.push(temp)
        target.value = ''
      } catch (error) {
        errorMsg.value = error
      }
    }

    const assignedShare = async () => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('workspace/assignedShare', {
        workspaceNodeId: props.workspaceNodeId,
        targetList: targetList.value,
        ...formData
      })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/closeModal')
      store.commit('helper/PUSH_message', t('RR0157'))
    }

    const removeTarget = (index) => targetList.value.splice(index, 1)

    watch(
      () => target.value,
      () => (errorMsg.value = '')
    )

    return {
      target,
      targetList,
      addToTargetList,
      errorMsg,
      formData,
      assignedShare,
      removeTarget
    }
  }
}
</script>
