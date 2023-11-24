<template lang="pug">
div(class="grid gap-y-4")
  p(class="text-body2 text-grey-900 leading-1.6 pb-3") {{ $t('RR0235') }}
  div(
    class="grid desktop:grid-cols-5 desktop:grid-rows-1 tablet:grid-cols-6 grid-cols-2 gap-x-3 gap-y-4 min-h-44.5 justify-between items-start"
  )
    div(
      v-for="(step, index) in stepList"
      :key="step.title"
      class="h-full flex flex-col gap-y-2 items-start desktop:col-span-1"
      :class="{ 'tablet:col-span-2': index < 3, 'tablet:col-span-3': index >= 3, 'col-span-1': index < 4, 'col-span-2': index === 4 }"
    )
      div(class="w-full flex items-center justify-between text-grey-600")
        span(class="text-caption font-bold") TIER {{ index + 1 }}
        f-svg-icon(iconName="arrow_forward" size="14")
      div(
        class="w-full flex-grow rounded p-3 bg-peacock-50 grid gap-y-2 content-start items-start justify-start text-grey-900"
      )
        f-svg-icon(:iconName="step.icon" size="32")
        span(class="text-caption/1.3 font-bold") {{ step.title }}
        span(class="text-caption2/1.3") {{ step.description }}
  div(class="w-full h-px bg-grey-250")
  div(class="flex tablet:flex-row flex-col gap-x-3 gap-y-3 items-center min-h-40.5")
    template(v-for="(process, index) in processList" :key="process.title")
      div(class="h-full w-full flex flex-col gap-y-3 items-start" :class="process.width")
        span(class="text-caption font-bold") {{ process.title }}
        div(
          class="w-full flex-grow px-2 py-3 grid gap-y-3 content-start rounded"
          :class="process.color"
        )
          div(
            v-for="content in process.contentList"
            :key="content.name"
            class="flex items-center gap-x-3 text-grey-900"
          )
            f-svg-icon(:iconName="content.icon" size="24")
            span(class="text-caption") {{ content.name }}
              p(v-if="content.subName" class="text-caption/1.3 text-grey-900") {{ content.subName }}
      f-svg-icon(
        v-if="index !== processList.length - 1"
        iconName="arrow_forward"
        size="14"
        class="text-grey-600 transform tablet:rotate-0 rotate-90"
      )
  p(class="text-body2 text-grey-900 leading-1.6 pt-8 pb-2") {{ $t('RR0236') }}
</template>

<script setup lang="ts">
// import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

// const { t } = useI18n()

const stepList = computed(() => [
  {
    icon: 'operations',
    title: 'Direct operations',
    description: 'offices, transportation, warehousing, and stores.',
  },
  {
    icon: 'product',
    title: 'Final assembly of the finished product',
    description: 'handbag, clothing, jewelry, etc.',
  },
  {
    icon: 'materials',
    title: 'Production of items needed to assemble the finished product',
    description: 'fabric, buttons, shoe heels, etc.',
  },
  {
    icon: 'raw_materials',
    title: 'Processing of raw materials and yarn production',
    description: 'thread, leather tanning',
  },
  {
    icon: 'cotton',
    title: 'Production of raw materials',
    description: 'farming, mining, extraction, etc.',
  },
])
const processList = computed(() => [
  {
    title: 'INPUT',
    color: 'bg-peacock-50',
    width: 'w-[32%]',
    contentList: [
      {
        icon: 'materials',
        name: 'Raw materials',
      },
      {
        icon: 'water',
        name: 'Water',
      },
      {
        icon: 'chemicals',
        name: 'Chemicals',
      },
    ],
  },
  {
    title: 'PROCESS',
    color: 'bg-yellow-0',
    width: 'w-[23%]',
    contentList: [
      {
        icon: 'energy',
        name: 'Energy',
      },
      {
        icon: 'heat',
        name: 'Heat',
      },
    ],
  },
  {
    title: 'OUTPUT',
    color: 'bg-red-0',
    width: 'w-[32%]',
    contentList: [
      {
        icon: 'product',
        name: 'Product',
      },
      {
        icon: 'scraps',
        name: 'Scraps',
      },
      {
        icon: 'emissions',
        name: 'Emissions',
        subName: 'gas',
      },
      {
        icon: 'waste',
        name: 'Waste',
        subName: 'liquid/solid',
      },
    ],
  },
])
</script>
