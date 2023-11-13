<template lang="pug">
modal-behavior(
  :header="$t('FF0022')"
  :primaryBtnText="$t('UU0020')"
  :primaryBtnDisabled="!isFormValid"
  @click:primary="createCollectionForModal"
)
  div(class="w-84")
    h6(class="text-body2 font-bold text-grey-900 mb-2") {{ $t('EE0065') }}
    f-input-text(
      ref="refInputCollectionName"
      v-model:textValue="collectionName"
      required
      :rules="[inputRules.required(), inputRules.maxLength(COLLECTION_NAME_MAX_LENGTH)]"
      :hintError="isCollectionNameExist ? $t('WW0001') : ''"
    )
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { COLLECTION_NAME_MAX_LENGTH } from '@/utils/constants'
import { useWorkspaceStore } from '@/stores/workspace'
import { inputRules } from '@frontier/lib'
import { FInputText } from '@frontier/ui-component'

const props = defineProps<{
  nodeId: number
  callback: () => void
}>()

const store = useStore()
const workspaceStore = useWorkspaceStore()
const collectionName = ref('')
const isCollectionNameExist = ref(false)
const refInputCollectionName = ref<InstanceType<typeof FInputText>>()

const isFormValid = computed(
  () =>
    !refInputCollectionName.value?.isError && collectionName.value?.length > 0
)

watch(
  () => collectionName.value,
  () => (isCollectionNameExist.value = false)
)
const createCollectionForModal = async () => {
  try {
    await workspaceStore.ogBaseWorkspaceApi('createWorkspaceCollection', {
      nodeId: props.nodeId,
      collectionName: collectionName.value,
      description: null,
      trendBoard: null,
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
