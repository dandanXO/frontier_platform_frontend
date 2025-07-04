<template lang="pug">
div(class="rounded-lg p-4 flex flex-col gap-y-2 bg-grey-50-v1")
  slot(name="slot:prepend-item")
  div(class="flex items-center gap-4")
    p(class="w-17 text-caption text-grey-700-v1") {{ $t('PP0010') }}
    material-u3m-status-label(:status="u3m.status")

  div(v-if="u3m.status === U3M_STATUS.COMPLETED" class="flex items-center gap-x-2")
    p(class="w-17 text-caption text-grey-700-v1") {{ $t('RR0188') }}
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
