<template lang="pug">
div(class="grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-grey-50")
  row-item-content(
    :material="material"
    v-model:selectedList="innerSelectedList"
    :canEdit="false"
  )
    template(#slot:unit-info)
      div(class="flex items-center pt-1 pb-2")
        f-avatar(:imageUrl="node.nodeMeta.unitLogo" type="org" size="sm")
        p(class="text-caption font-bold text-grey-900") {{ node.nodeMeta.unitName }}
    template(#slot:action)
      btn-pick-tooltip(
        :isPicked="node.moodboardInfo.isPicked"
        @togglePick="$emit('togglePick')"
      )
  div(class="text-grey-600 flex flex-col gap-3.5 col-span-1")
    f-tooltip-standard(
      v-for="item in optionList[0]"
      :key="item.id"
      class="cursor-pointer"
      boundaryReference="search-table-header"
      :tooltipMessage="item.name(node)"
    )
      template(#slot:tooltip-trigger)
        div(
          class="w-7.5 h-7.5 flex justify-center items-center"
          :class="[item.disabled && item.disabled(node) ? 'text-grey-250 cursor-default' : 'hover:bg-primary-400/10 hover:text-primary-400 rounded-full']"
          @click="item.func(node)"
        )
          f-svg-icon(v-if="item.icon" :iconName="item.icon(node)" size="24")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RowItemContent from '@/components/common/rowItem/RowItemContent.vue'
import type { Material, MoodboardNodeChild } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import { isEqual } from '@frontier/lib'

const props = defineProps<{
  selectedList: MoodboardNodeChild[]
  node: MoodboardNodeChild
  optionList: FunctionOption<MoodboardNodeChild>[][]
}>()

const emit = defineEmits<{
  (e: 'update:selectedList', v: MoodboardNodeChild[]): void
  (e: 'togglePick'): void
}>()

const material = computed(() => props.node.nodeProperty as Material)

const innerSelectedList = computed({
  get: () => props.selectedList.map((item) => item.nodeProperty as Material),
  set: () => {
    const tempArr = [...props.selectedList]
    const index = tempArr.findIndex((item) => isEqual(item, props.node))
    if (!~index) {
      tempArr.push(props.node)
    } else {
      tempArr.splice(index, 1)
    }
    emit('update:selectedList', tempArr)
  },
})
</script>
