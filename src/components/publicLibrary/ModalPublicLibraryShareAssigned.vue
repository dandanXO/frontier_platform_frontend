<template lang="pug">
div(class="w-120.5 px-8")
  h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{ $t("RR0155") }}
  input-text-icon(
    v-model:textValue="target"
    prependIcon="search"
    :label="$t('RR0156')"
    :placeholder="$t('RR0150')"
    :disabledIcon="target === ''"
    :customErrorMsg="errorMsg"
    @click:icon="addToTargetList"
    class="mb-6"
  )
  overlay-scrollbar-container(class="max-h-69")
    div(class="grid gap-y-6")
      div(v-for="(item, index) in targetList" class="flex items-center gap-x-3")
        img(v-if="item.logo" :src="item.logo" class="w-9 h-9 rounded-full")
        div(v-else class="w-9 h-9 rounded-full border-black-500 border border-dashed")
        div(class="text-body2 flex-grow")
          p(class="text-primary line-clamp-1") {{ item.name }}
          p(v-if="item.number" class="text-black-500") {{ item.number }}
        p(class="text-body2 text-black-500 pr-2.5 cursor-pointer" @click="removeTarget(index)") {{ $t("FF0060") }}
  btn-group(
    class="h-25"
    :primaryText="$t('RR0079')"
    :secondaryButton="false"
    :primaryButtonDisabled="targetList.length === 0"
    @click:primary="assignedShare"
  )
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
export default {
  name: 'ModalPublicLibraryShareAssigned',
  props: {
    nodeKey: {
      type: String,
      required: true
    },
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const target = ref('')
    const targetList = ref([])
    const errorMsg = ref('')

    const addToTargetList = async () => {
      const frozenTargetValue = target.value.trim()
      const existedTarget = targetList.value.find(({ name, number }) => name === frozenTargetValue || number === frozenTargetValue)
      if (existedTarget) {
        switch (existedTarget.type) {
          case 1:
            return (errorMsg.value = t('WW0058'))
          case 2:
            return (errorMsg.value = t('WW0059'))
          case 3:
            return (errorMsg.value = t('WW0057'))
        }
      }

      const temp = await store.dispatch('publicLibrary/getShareTarget', {
        nodeKey: props.nodeKey,
        target: frozenTargetValue
      })
      targetList.value.push(temp)
      target.value = ''
    }

    const assignedShare = async () => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('publicLibrary/assignedShare', {
        nodeKey: props.nodeKey,
        targetList: targetList.value
      })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/closeModal')
      store.commit('helper/PUSH_message', t('RR0157'))
    }

    const removeTarget = (index) => targetList.value.splice(index, 1)

    return {
      target,
      targetList,
      errorMsg,
      addToTargetList,
      removeTarget,
      assignedShare
    }
  }
}
</script>
