<template lang="pug">
div(class="flex flex-col gap-y-17.5")
  div(class="flex items-center h-16")
    h5(class="text-h5 font-bold") Material Information
  div(class="flex flex-col divide-y divide-grey-250")
    div(class="pl-15")
      block-material-type
    div(class="pl-15")
      f-tabs(:tabList="tabList" keyField="id" class="pt-10")
        template(#default="{ currentTab }")
          div(class="pt-10 grid gap-y-10")
            block-material-specification(
              v-show="currentTab === TAB.SPECIFICATION"
            )
            block-material-tags(v-show="currentTab === TAB.TAGS")
            block-material-pricing(v-show="currentTab === TAB.PRICING")
            block-material-inventory(v-show="currentTab === TAB.INVENTORY")
            block-material-upload-files(
              v-show="currentTab === TAB.UPLOAD_FILES"
            )
  div(class="flex flex-row gap-x-2 pl-15 justify-end w-full")
    f-button(type="secondary" size="md" @click="emits('cancel')") {{ $t('UU0002') }}
    f-button(
      type="primary"
      size="md"
      :disabled="submitCount > 0 && !meta.valid"
      @click="submit"
    ) {{ $t('UU0020') }}
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import BlockMaterialType from '@/components/assets/edit/BlockMaterialType.vue'
import BlockMaterialSpecification from '@/components/assets/edit/blockMaterialSpecification/BlockMaterialSpecification.vue'
import BlockMaterialTags from '@/components/assets/edit/BlockMaterialTags.vue'
import BlockMaterialInventory from '@/components/assets/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/edit/BlockMaterialPricing.vue'
import BlockMaterialUploadFiles from '@/components/assets/edit/BlockMaterialUploadFiles.vue'
import type {
  MaterialFormService,
  MaterialU3mSelectService,
  MaterialMultimediaCreateService,
  MaterialAttachmentCreateService,
} from '@/types'
import type { MaterialOptions } from '@frontier/platform-web-sdk'
import useMaterialForm from '@/composables/material/useMaterialForm'
import type { AttachmentCreateItem, MultimediaCreateItem } from '@/types'
import useU3mSelect from '@/composables/material/useU3mSelect'
import useMultimediaCreate from '@/composables/material/useMultimediaCreate'
import useAttachmentCreate from '@/composables/material/useAttachmentCreate'
import {
  materialAttachmentCreateServiceKey,
  materialFormServiceKey,
  materialMultimediaCreateServiceKey,
  materialU3mSelectServiceKey,
} from '@/utils/constants'

const props = defineProps<{
  materialOptions: MaterialOptions
}>()

const emits = defineEmits<{
  (
    e: 'submit',
    payload: {
      form: ReturnType<typeof useMaterialForm>['values']
      multimediaList: MultimediaCreateItem[]
      attachmentList: AttachmentCreateItem[]
      u3m?: {
        u3mFile: File
        needToGeneratePhysical: boolean
      } | null
    }
  ): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()

const materialFormService: MaterialFormService = useMaterialForm({
  materialOptions: props.materialOptions,
})

const u3mSelectService: MaterialU3mSelectService = useU3mSelect()
const multimediaCreateService: MaterialMultimediaCreateService =
  useMultimediaCreate()
const attachmentCreateService: MaterialAttachmentCreateService =
  useAttachmentCreate()

provide(materialFormServiceKey, materialFormService)
provide(materialU3mSelectServiceKey, u3mSelectService)
provide(materialMultimediaCreateServiceKey, multimediaCreateService)
provide(materialAttachmentCreateServiceKey, attachmentCreateService)

const { submitCount, meta, handleSubmit } = materialFormService

const TAB = {
  SPECIFICATION: 0,
  TAGS: 1,
  PRICING: 2,
  INVENTORY: 3,
  UPLOAD_FILES: 4,
}

const tabList = computed(() => [
  { name: 'Specification', id: TAB.SPECIFICATION },
  { name: t('RR0133'), id: TAB.TAGS },
  { name: t('RR0134'), id: TAB.PRICING },
  { name: t('RR0135'), id: TAB.INVENTORY },
  { name: t('Upload Files'), id: TAB.UPLOAD_FILES },
])

const submit = handleSubmit(async (form) => {
  emits('submit', {
    form,
    multimediaList: multimediaCreateService.multimediaList,
    attachmentList: attachmentCreateService.attachmentList,
    u3m: u3mSelectService.u3mFile.value
      ? {
          u3mFile: u3mSelectService.u3mFile.value,
          needToGeneratePhysical: u3mSelectService.needToGeneratePhysical.value,
        }
      : undefined,
  })
})
</script>
