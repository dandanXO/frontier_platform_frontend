<template lang="pug">
modal-behavior(
  :header="$t('FF0022')"
  :primaryBtnText="$t('UU0020')"
  :primaryBtnDisabled="collectionName === ''"
  @click:primary="createCollectionForModal"
)
  div(class="w-84")
    h6(class="text-body2 font-bold text-grey-900 mb-2") {{ $t('EE0065') }}
    f-input-text(v-model:textValue="collectionName" required :rules="[$inputRules.required()]")
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalCreateCollectionSimple',
  props: {
    id: {
      type: Number,
      required: true
    },
    workspaceNodeLocation: {
      type: Number,
      required: true
    },
    workspaceNodeId: {
      type: Number,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const store = useStore()

    const collectionName = ref('')

    const createCollectionForModal = async () => {
      await store.dispatch('workspace/createCollectionForModal', {
        id: props.id,
        workspaceNodeLocation: props.workspaceNodeLocation,
        workspaceNodeId: props.workspaceNodeId,
        collectionName: collectionName.value
      })
      store.dispatch('helper/closeModal')
      props.callback()
    }

    return {
      collectionName,
      createCollectionForModal
    }
  }
}
</script>
