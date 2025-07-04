<template>
  <f-accordion
    :title="$t('EE0129')"
    class="bg-white"
    :defaultExpanded="defaultExpanded"
  >
    <div class="flex flex-col gap-y-4 p-3">
      <f-select-input
        ref="certificationInputRef"
        :selectValue="certificationTagIdList.value"
        @update:selectValue="certificationTagIdList.onInput"
        :canAddNew="false"
        :dropdownMenuTree="inputMenu.specOptions.certificateList"
        :placeholder="$t('MI0052')"
        :hintError="
          materialFormService.displayErrors.value[
            'tagInfo.certificationTagIdList'
          ]
        "
        multiple
        :multipleTagInputValidations="[inputValidate, lengthValidate]"
      ></f-select-input>
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { inject, onMounted, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FAccordion from '@frontier/ui-component/src/FAccordion/FAccordion.vue'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import { materialFormServiceKey } from '@/utils/constants'
import type { MaterialFormService } from '@/types'

const props = defineProps<{
  defaultExpanded?: boolean
  focusOnLoad?: boolean
}>()

const { t } = useI18n()

// Inject the MaterialFormService
const materialFormService = inject(
  materialFormServiceKey
) as MaterialFormService

// Access inputMenu and defineInputBinds from materialFormService
const { inputMenu, defineInputBinds } = materialFormService

// Certification tags binding
const certificationTagIdList = defineInputBinds(
  'tagInfo.certificationTagIdList'
)

// Ref for input field
const certificationInputRef = ref<InstanceType<typeof FSelectInput> | null>(
  null
)

// Multiple chips rules
const inputValidate = (str: string) => str.replace(/,/g, '')
const lengthValidate = (str: string) => str.slice(0, 500)

// Focus on input field when component mounts and focusOnLoad is true
onMounted(async () => {
  if (props.focusOnLoad) {
    await nextTick()
    // Wait a bit more for the accordion animation to complete
    setTimeout(() => {
      if (certificationInputRef.value) {
        certificationInputRef.value.focus()
      }
    }, 300)
  }
})
</script>
