<template lang="pug">
div(class="flex gap-y-2.5")
  template(v-if="mode === CREATE_EDIT.CREATE")
    div(class="flex items-center gap-x-6.5")
      custom-button(:disabled="!hasU3mQuota" @click="openModalUploadU3mFile()") {{ $t('UU0022') }}
      f-infobar(
        v-if="!hasU3mQuota"
        :display="DISPLAY.FLEX"
        :notifyType="NOTIFY_TYPE.WARNING"
        :messageText="$t('WW0094')"
        :action="{ text: $t('UU0085'), handler: goToBillings }"
      )
    button(
      class="border outline-none rounded pt-2 pr-4 pl-3 pb-3.5 w-75.5 flex justify-between items-end"
      :class="[hasU3mQuota ? 'border-grey-150' : 'border-grey-100']"
      @click="openModalUploadU3mFile(true)"
    )
      p(
        class="text-body2"
        :class="[hasU3mQuota ? 'text-grey-600 underline' : 'text-grey-250']"
      ) {{ $t('DD0122') }}
      a(
        href="https://www.shimaseiki.com/product/design/software/"
        target="_blank"
        @click.stop
      )
        img(:src="APEXFIZ" alt="APEXFIZ" class="w-21 h-5")
  template(v-if="mode === CREATE_EDIT.EDIT && status")
    custom-button(
      v-if="status === U3M_STATUS.COMPLETED"
      class="w-full"
      @click="openModalUploadU3mFile()"
    ) {{ $t('UU0022') }}
    custom-button(
      v-if="status === U3M_STATUS.UNSUCCESSFUL"
      class="w-full"
      @click="openModalUploadU3mFile()"
    ) {{ $t('UU0022') }}
    template(
      v-if="hasU3mQuota && [U3M_STATUS.INITIAL, U3M_STATUS.UNQUALIFIED].includes(status)"
    )
      custom-button(class="w-full" @click="openModalUploadU3mFile()") {{ $t('UU0022') }}
  div(v-if="hasUploadedU3mFile" class="flex flex-col gap-y-2")
    div(class="bg-grey-100 py-3 px-4 flex items-center rounded")
      div(class="bg-grey-150 flex items-center justify-center p-2 rounded")
        f-svg-icon(iconName="file" size="20" class="text-grey-600")
      div(class="flex-grow pl-2 pr-4 flex flex-col gap-y-1")
        p(class="text-body2 font-bold text-grey-800 line-clamp-1") {{ u3mFile.name }}
        p(class="text-caption text-grey-600") {{ hasPhysicalData ? $t('EE0169') : $t('EE0170') }}
      f-svg-icon(
        iconName="delete"
        size="24"
        class="text-grey-600 cursor-pointer"
        @click="removeU3mFile"
      )
    div(v-if="!hasPhysicalData")
      f-input-checkbox(
        v-model:inputValue="needToGeneratePhysical"
        :label="$t('EE0171')"
        binary
        iconSize="20"
      )
    f-infobar(
      class="mt-0.5"
      :notifyType="NOTIFY_TYPE.INFO"
      :title="$t('EE0172')"
      :messageText="$t('EE0173', { PP0001: $t('PP0001') })"
    )
</template>

<script setup lang="ts">
import { inject } from 'vue'
import {
  NOTIFY_TYPE,
  CREATE_EDIT,
  DISPLAY,
  U3M_STATUS,
  materialU3mSelectServiceKey,
} from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import type { MaterialU3mSelectService } from '@/types'
import APEXFIZ from '@/assets/images/APEXFIZ.png'
import CustomButton from '@/components/common/material/u3m/CustomButton.vue'

defineProps<{
  mode: CREATE_EDIT
  status?: U3M_STATUS
}>()

const { goToBillings } = useNavigation()

const u3mSelectService = inject<MaterialU3mSelectService>(
  materialU3mSelectServiceKey
)

if (!u3mSelectService) {
  throw new Error('MaterialU3mSelectService is not provided')
}

const {
  u3mFile,
  hasU3mQuota,
  hasPhysicalData,
  hasUploadedU3mFile,
  needToGeneratePhysical,
  openModalUploadU3mFile,
  removeU3mFile,
} = u3mSelectService
</script>
