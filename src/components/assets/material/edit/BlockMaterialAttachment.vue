<template lang="pug">
div
  div(class="h-15 flex items-center")
    h5(class="text-h5 text-primary font-bold") {{$t('DD0026')}}
  div(class='px-15')
    div(class='mt-5 mb-10')
      div(class='mb-4.5 text-body2') {{$t('DD0027')}}
      btn(size='md' @click='openModalUpload') {{$t('UU0022')}}
    div(class='flex gap-5')
      single-attachment(
        v-for='attachment in attachmentList'
        :attachment='attachment'
        @handleRemove='handleRemove'
        @openModalPreview='openModalPreview'
      )
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import SingleAttachment from '@/components/assets/material/edit/SingleAttachment'

export default {
  name: 'BlockMaterialAttachment',
  props: {
    tempMaterialId: {
      type: String
    }
  },
  components: { SingleAttachment },
  setup (props) {
    const store = useStore()
    const attachmentList = computed(() => store.getters['material/attachmentList'])

    const openModalUpload = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-upload-attachment',
        properties: {
          tempMaterialId: props.tempMaterialId
        }
      })
    }

    const handleRemove = (tempMaterialAttachmentId) => {
      console.log('handleRemove')
    }

    const openModalPreview = () => {
      console.log('openModalPreview')
    }

    return {
      attachmentList,
      openModalUpload,
      handleRemove,
      openModalPreview
    }
  }
}
</script>
