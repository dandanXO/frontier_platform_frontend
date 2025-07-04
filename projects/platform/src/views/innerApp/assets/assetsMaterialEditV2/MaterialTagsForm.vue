<template>
  <f-accordion
    :title="$t('RR0133')"
    class="bg-white"
    :defaultExpanded="defaultExpanded"
    :desc="$t('RR0557')"
  >
    <div class="flex flex-col gap-y-4 p-3">
      <TCTabs v-model="activeTagTab" :tabs="tagTabsDefinition" />

      <div v-if="activeTagTab === 'public'">
        <f-select-input
          ref="publicTagInputRef"
          :selectValue="publicTagList.value"
          @update:selectValue="publicTagList.onInput"
          :dropdownMenuTree="inputMenu.menuTreePublicTag.value"
          @addNew="inputMenu.addNewPublicTag"
          :placeholder="$t('RR0288')"
          :hintError="
            materialFormService.displayErrors.value['tagInfo.tagList']
          "
          multiple
          :multipleTagInputValidations="[inputValidate, lengthValidate]"
        ></f-select-input>
      </div>

      <div v-if="activeTagTab === 'private'">
        <f-select-input
          ref="privateTagInputRef"
          :selectValue="privateTagList.value"
          @update:selectValue="privateTagList.onInput"
          :dropdownMenuTree="inputMenu.menuTreePrivateTag.value"
          @addNew="inputMenu.addNewPrivateTag"
          :placeholder="$t('RR0290')"
          :hintError="
            materialFormService.displayErrors.value['internalInfo.tagList']
          "
          multiple
          :multipleTagInputValidations="[inputValidate, lengthValidate]"
        ></f-select-input>
      </div>
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  onMounted,
  nextTick,
  defineComponent,
} from 'vue'
import { useI18n } from 'vue-i18n'
import FAccordion from '@frontier/ui-component/src/FAccordion/FAccordion.vue'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import TCTabs from '@/components/TCTabs.vue'
import { materialFormServiceKey } from '@/utils/constants'
import type { MaterialFormService } from '@/types'

defineComponent({
  name: 'MaterialTagsForm',
})

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

// Tag related bindings
const publicTagList = defineInputBinds('tagInfo.tagList')
const privateTagList = defineInputBinds('internalInfo.tagList')

// Tag tab state
const activeTagTab = ref('public') // 'public', 'private'

// Refs for input fields
const publicTagInputRef = ref<InstanceType<typeof FSelectInput> | null>(null)
const privateTagInputRef = ref<InstanceType<typeof FSelectInput> | null>(null)

const tagTabsDefinition = computed(() => [
  {
    id: 'public',
    name: t('FF0030'), // Public
  },
  {
    id: 'private',
    name: t('FF0031'), // Private
  },
])

// Multiple chips rules
const inputValidate = (str: string) => str.replace(/,/g, '')
const lengthValidate = (str: string) => str.slice(0, 500)

// Focus on input field when component mounts and focusOnLoad is true
onMounted(async () => {
  if (props.focusOnLoad) {
    await nextTick()
    // Wait a bit more for the accordion animation to complete
    setTimeout(() => {
      const inputRef =
        activeTagTab.value === 'public'
          ? publicTagInputRef.value
          : privateTagInputRef.value
      if (inputRef) {
        inputRef.focus()
      }
    }, 300)
  }
})
</script>
