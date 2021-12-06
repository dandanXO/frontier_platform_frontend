<template lang="pug">
div(class="w-100 px-8")
  h6(class="text-h6 font-bold text-primary text-center mb-7.5") {{$t('EE0065')}}
  input-text(v-model:textValue="collectionName" required)
  btn-group(
    class="h-25"
    :primaryText="$t('UU0020')"
    :primaryButtonDisabled="collectionName === ''"
    @click:primary="createCollectionForModal"
    :secondaryButton="false"
  )
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
    type: {
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
        type: props.type,
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
