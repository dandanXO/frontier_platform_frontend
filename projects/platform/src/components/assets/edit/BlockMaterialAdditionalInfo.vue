<template lang="pug">
div
  div(class="h-15 flex items-center")
    h5(class="text-h5 text-primary font-bold") {{ $t("DD0026") }}
  div(class="px-15 grid gap-y-7.5 pt-5")
    f-input-chips(
      v-model:chips="material.certificateList"
      :label="$t('EE0129')"
      :optionList="specOptions.certificateList"
      :placeholder="$t('EE0131')"
      keyOptionDisplay="name"
    )
    div
      div(class="pb-10")
        p(class="text-body2 font-bold text-primary") {{ $t('EE0130') }}
        div(class="py-5 text-body2") {{ $t("DD0027") }}
        f-button(size="md" @click="openModalUpload") {{ $t("UU0022") }}
      div(v-if="attachmentList.length > 0" class="flex flex-wrap gap-5")
        attachment-item(
          v-for="(attachment, index) in attachmentList"
          :key="attachment.url"
          :attachmentList="attachmentList"
          :attachment="attachment"
          :index="index"
          @handleRemove="handleRemove"
        )
</template>

<script setup>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import AttachmentItem from '@/components/common/material/attachment/AttachmentItem.vue'
import useMaterialEdit from '@/composables/useMaterialEdit'

const props = defineProps({
  tempMaterialId: {
    type: String
  }
})

const { t } = useI18n()
const store = useStore()
const material = computed(() => store.getters['assets/material'])

const { specOptions } = useMaterialEdit(material.value)

const attachmentList = computed(() => store.getters['assets/attachmentList'])
const isEditMode = computed(() => store.getters['assets/material'].materialId !== null)

const openModalUpload = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-upload-file-general',
    properties: {
      acceptType: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'gif', 'mov', 'mp4'],
      uploadHandler: async (file, displayFileName) => {
        if (isEditMode.value) {
          await store.dispatch('assets/uploadAttachmentWhenUpdate', {
            file,
            displayFileName
          })
        } else {
          await store.dispatch('assets/uploadAttachmentWhenCreate', {
            tempMaterialId: props.tempMaterialId,
            file,
            displayFileName
          })
        }
      }
    }
  })
}

const handleRemove = (attachment) => {
  store.dispatch('helper/openModalConfirm', {
    type: 0,
    header: t('DD0068'),
    contentText: t('DD0069'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: async () => {
      if (isEditMode.value) {
        store.dispatch('assets/removeAttachmentWhenUpdate', {
          materialAttachmentId: attachment.materialAttachmentId
        })
      } else {
        store.dispatch('assets/removeAttachmentWhenCreate', {
          tempMaterialId: props.tempMaterialId,
          tempMaterialAttachmentId: attachment.tempMaterialAttachmentId
        })
      }
    },
    secondaryBtnText: t('UU0002')
  })
}
</script>
