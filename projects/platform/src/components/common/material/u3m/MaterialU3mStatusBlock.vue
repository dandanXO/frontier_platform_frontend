<template lang="pug">
div(class="bg-grey-50 rounded py-2 px-4 box-border flex flex-col gap-y-2")
  slot(name="slot:prepend-item")
  div(class="flex items-center gap-x-2")
    p(class="w-18 text-caption text-grey-600") {{ $t('PP0010') }}
    material-u3m-status-label(:status="u3m.status")
    f-svg-icon(
      v-if="[U3M_STATUS.IN_QUEUE, U3M_STATUS.PROCESSING].includes(u3m.status)"
      iconName="loading"
      size="16"
      class="text-primary-400"
    )
  div(v-if="u3m.status === U3M_STATUS.COMPLETED" class="flex items-center gap-x-2")
    p(class="w-18 text-caption text-grey-600") {{ $t('RR0188') }}
    div(class="flex items-center gap-x-3")
      f-avatar(
        :imageUrl="u3m.creatorAvatar"
        type="user"
        :labelColor="u3m.creatorUnitLabelColor"
        size="sm"
        :hasBorder="false"
      )
      div
        p(class="text-body2 text-grey-900 pb-1") {{ u3m.creator }}
        p(v-if="u3m.createDate" class="text-caption text-grey-600") {{ toStandardFormat(u3m.createDate) }}
  slot(name="slot:append-item")
</template>

<script setup lang="ts">
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import MaterialU3mStatusLabel from '@/components/common/material/u3m/MaterialU3mStatusLabel.vue'
import { U3M_STATUS } from '@/utils/constants'
import { toStandardFormat } from '@frontier/lib'

defineProps<{
  u3m: MaterialU3m | MaterialCustomU3m
}>()
</script>
