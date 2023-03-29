<template lang="pug">
modal-behavior(
  :header="$t('FF0022')"
  :primaryBtnText="$t('UU0020')"
  :primaryBtnDisabled="!collectionName"
  @click:primary="createCollectionForModal"
)
  div(class="w-84")
    h6(class="text-body2 font-bold text-grey-900 mb-2") {{ $t('EE0065') }}
    f-input-text(
      v-model:textValue="collectionName"
      required
      :rules="[$inputRules.required()]"
      :hintError="isCollectionNameExist ? $t('WW0001') : ''"
    )
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  workspaceNodeLocation: {
    type: Number,
    required: true,
  },
  workspaceNodeId: {
    type: Number,
    required: true,
  },
  callback: {
    type: Function,
    required: true,
  },
})

const collectionName = ref('')
const isCollectionNameExist = ref(false)
watch(
  () => collectionName.value,
  () => (isCollectionNameExist.value = false)
)
const createCollectionForModal = async () => {
  try {
    await store.dispatch('workspace/createCollectionForModal', {
      id: props.id,
      workspaceNodeLocation: props.workspaceNodeLocation,
      workspaceNodeId: props.workspaceNodeId,
      collectionName: collectionName.value,
    })
    store.dispatch('helper/closeModal')
    props.callback()
  } catch (error) {
    const { code } = error
    switch (code) {
      case 'ERR0035':
        isCollectionNameExist.value = true
        break
      default:
        throw error
    }
  }
}
</script>
