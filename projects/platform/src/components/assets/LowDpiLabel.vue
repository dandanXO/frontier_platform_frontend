<template lang="pug">
f-tooltip-standard(
  class="flex-start"
  :theme="THEME.DARK"
  classContent="!bg-white gap-2 flex flex-col !text-grey-700"
  :placement="TOOLTIP_PLACEMENT.BOTTOM"
)
  template(#slot:tooltip-content)
    p {{ $t('DD0158') }}
  template(#slot:tooltip-trigger)
    f-badge(type="warning" class="cursor-help") &lt; 300 DPI
</template>

<script lang="ts" setup>
import { THEME, TOOLTIP_PLACEMENT } from '@frontier/constants'
</script>
