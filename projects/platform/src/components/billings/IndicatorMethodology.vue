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
        span(class="text-caption font-bold") {{ $t('M2F054', { number: index + 1 }) }}
        f-svg-icon(iconName="arrow_forward" size="14")
      div(
        class="w-full flex-grow rounded p-3 bg-peacock-50 grid gap-y-2 content-start items-start justify-start text-grey-900"
      )
        f-svg-icon(:iconName="step.icon" size="32")
        span(class="text-caption/1.3 font-bold") {{ step.title }}
        span(class="text-caption2/1.3") {{ step.description }}
  div(class="w-full h-px bg-grey-250")
  p(class="text-body2 text-grey-900 leading-1.6 pb-2") {{ $t('RR0236') }}
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const stepList = computed(() => [
  {
    icon: 'operations',
    title: t('M2F055'),
    description: t('M2F060'),
  },
  {
    icon: 'product',
    title: t('M2F056'),
    description: t('M2F061'),
  },
  {
    icon: 'materials',
    title: t('M2F057'),
    description: t('M2F062'),
  },
  {
    icon: 'raw_materials',
    title: t('M2F058'),
    description: t('M2F063'),
  },
  {
    icon: 'cotton',
    title: t('M2F059'),
    description: t('M2F064'),
  },
])
const processList = computed(() => [
  {
    title: t('M2F065'),
    color: 'bg-peacock-50',
    width: 'w-[32%]',
    contentList: [
      {
        icon: 'materials',
        name: t('M2F068'),
      },
      {
        icon: 'water',
        name: t('M2F069'),
      },
      {
        icon: 'chemicals',
        name: t('M2F070'),
      },
    ],
  },
  {
    title: t('M2F066'),
    color: 'bg-yellow-0',
    width: 'w-[23%]',
    contentList: [
      {
        icon: 'energy',
        name: t('M2F071'),
      },
      {
        icon: 'heat',
        name: t('M2F072'),
      },
    ],
  },
  {
    title: t('M2F067'),
    color: 'bg-red-0',
    width: 'w-[32%]',
    contentList: [
      {
        icon: 'product',
        name: t('M2F073'),
      },
      {
        icon: 'scraps',
        name: t('M2F074'),
      },
      {
        icon: 'emissions',
        name: t('M2F075'),
        subName: 'gas',
      },
      {
        icon: 'waste',
        name: t('M2F076'),
        subName: 'liquid/solid',
      },
    ],
  },
])
</script>
