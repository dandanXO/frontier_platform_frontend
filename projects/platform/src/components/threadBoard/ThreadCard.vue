<template lang="pug">
div(ref="threadCardRef" :class="containerClass" @click="handleClick")
  div(class="h-8 flex items-center justify-between")
    div(class="flex items-center gap-x-2")
      img(
        v-defaultImg
        class="w-8 h-8 rounded"
        :src="thread.materialCoverImg"
        @click="handleMaterialClick($event, thread, false)"
      )
      div(
        class="group flex items-center text-body2"
        @click="handleMaterialClick($event, thread, false)"
      )
        f-tooltip-standard(:tooltipMessage="thread.materialNo")
          template(#slot:tooltip-trigger)
            p(
              class="text-caption line-clamp-1"
              :class="[thread.hasMaterialDeleted || thread.hasMaterialNoAccess ? 'text-grey-250' : 'text-grey-600 hover:text-primary-400 hover:underline hover:cursor-pointer']"
            ) {{ thread.materialNo }}
              span(v-if="thread.hasMaterialDeleted") &nbsp({{ $t('TT0113') }})
              span(v-else-if="thread.hasMaterialNoAccess") &nbsp({{ $t('TT0107') }})
        f-svg-icon(
          v-if="!thread.hasMaterialDeleted && !thread.hasMaterialNoAccess"
          iconName="open_in_new"
          size="14"
          class="ml-1 invisible group-hover:visible text-grey-600 hover:text-primary-400 hover:cursor-pointer"
          @click="handleMaterialClick($event, thread, true)"
          tooltip="TT0074"
        )
    div(class="flex flex-row")
      f-avatar-group(
        :itemList="orgList"
        type="org"
        size="sm"
        placement="top-start"
      )
  div(class="flex flex-col gap-3")
    div(class="flex flex-row items-start gap-2")
      p(
        class="text-body2 text-grey-900 leading-1.6"
        :class="{ 'text-primary-400': active, 'font-bold': thread.unreadStickerQty !== 0 }"
      ) {{ thread.digitalThreadName }}
      p(
        class="h-4.5 w-5 bg-primary-400 rounded-full flex-shrink-0 flex items-center justify-center"
        v-if="thread.unreadStickerQty !== 0"
      )
        span(class="text-grey-0 text-caption") {{ unreadStickerQtyDisplay }}
    div(class="flex items-center gap-x-3")
      div(
        v-if="thread.stickerStatistics.externalQty > 0 || thread.stickerStatistics.internalQty > 0"
        class="flex items-center gap-x-1"
      )
        div(
          v-if="thread.stickerStatistics.externalQty > 0"
          class="w-1 h-4 rounded-[18px] bg-forestgreen-300"
        )
        div(
          v-if="thread.stickerStatistics.internalQty > 0"
          class="w-1 h-4 rounded-[18px] bg-grey-300"
        )
      div(class="flex items-center gap-x-1.5 text-grey-600")
        f-svg-icon(iconName="sticker" size="14")
        span(class="text-caption") {{ thread.stickerStatistics.totalQty }}
      div(class="flex items-center gap-x-1.5 text-grey-600")
        f-svg-icon(iconName="star" size="16")
        span(class="text-caption") {{ thread.stickerStatistics.starredQty }}
      div(class="flex items-center gap-x-1.5 text-grey-600")
        f-svg-icon(iconName="tag" size="14")
        span(class="text-caption") {{ thread.tagList.length }}
  div(class="h-6 flex justify-between items-end")
    p(class="text-caption leading-1 text-grey-300") {{ toDigitalThreadDateFormat(thread.createDate) }}
  div(class="absolute right-3.5 bottom-3")
    f-popper(placement="top" :offset="[0, 8]" @click.stop)
      template(#trigger="{ isExpand }")
        div(
          class="w-12 h-7.5 flex items-center justify-center border border-grey-150 rounded p-[1px] bg-grey-0"
        )
          div(
            class="w-full h-full flex flex-row items-center justify-center gap-x-2 rounded-sm hover:bg-grey-100"
            :class="[isExpand ? 'bg-primary-50 border-primary-50 text-primary-400' : 'border-grey-150 text-grey-600']"
          )
            f-svg-icon(iconName="person" size="20")
            span(class="text-caption font-bold") {{ thread.participantList.length }}
      template(#content)
        f-contextual-menu(
          v-if="thread.participantList.length"
          :menuTree="participantMenuTree"
        )
        div(v-else class="w-35 h-10 pl-4 bg-grey-0 rounded shadow-16 flex items-center") 
          span(class="text-caption text-grey-600") {{ $t('TT0141') }}
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type FScrollbarContainer from '@frontier/ui-component/src/FScrollbarContainer/FScrollbarContainer.vue'
import type { DigitalThreadBase } from '@frontier/platform-web-sdk'
import useBadgeCountDisplay from '@/composables/useBadgeCountDisplay'
import { toDigitalThreadDateFormat } from '@/utils/date'

const props = withDefaults(
  defineProps<{
    thread: DigitalThreadBase
    active?: boolean
    dragging?: boolean
    horizontalScrollContainer?: HTMLDivElement
    verticalScrollContainer?: InstanceType<typeof FScrollbarContainer>
  }>(),
  { active: false }
)

const emit = defineEmits<{
  (e: 'active'): void
  (e: 'materialClick', thread: DigitalThreadBase, openInNew: boolean): void
}>()

/**
 * 開啟 Sticker Drawer 時，Thread Card 和 Sticker Drawer 至少要相距這個距離*
 */
const GAP = 32
const STICKER_DRAWER_WIDTH = 474
const RIGHT_OFFSET = STICKER_DRAWER_WIDTH + GAP

const threadCardRef = ref<HTMLDivElement>()
const isOutsideClicked = ref(false)
const focused = computed(() => props.active && isOutsideClicked.value)

const orgList = computed(() => {
  return [
    {
      name: props.thread.creatorUnitName,
      imageUrl: props.thread.creatorUnitLogo,
      labelColor: props.thread.creatorUnitLabelColor,
    },

    {
      name: props.thread.materialOwnerUnitName,
      imageUrl: props.thread.materialOwnerUnitLogo,
      labelColor: props.thread.materialOwnerUnitLabelColor,
    },
  ]
})

const unreadStickerQty = computed(() => props.thread.unreadStickerQty)
const unreadStickerQtyDisplay = useBadgeCountDisplay(unreadStickerQty)

const containerClass = computed(() => {
  const baseClass = [
    'relative flex-shrink-0 w-77.5 min-h-33.5 px-3.5 py-3 rounded-md cursor-pointer flex flex-col gap-0.5 shadow-4 outline',
  ]

  if (focused.value) {
    baseClass.push(
      'bg-primary-50 outline-primary-300 outline-1 -outline-offset-1'
    )
  } else if (props.active) {
    baseClass.push(
      'bg-primary-50 outline-primary-300 outline-1 -outline-offset-1'
    )
  } else if (props.dragging) {
    baseClass.push('bg-grey-100 outline-2 -outline-offset-2 outline-grey-250 ')
  } else {
    const hoverClass =
      'hover:outline-2 hover:-outline-offset-2 hover:outline-grey-200'
    const pressedClass =
      'active:outline-2 active:-outline-offset-2 active:outline-grey-250 active:bg-grey-100'
    baseClass.push('bg-grey-50 outline-1 -outline-offset-1 outline-grey-150')
    baseClass.push(hoverClass)
    baseClass.push(pressedClass)
  }

  return baseClass
})

onClickOutside(threadCardRef, () => {
  if (props.active) {
    isOutsideClicked.value = true
  }
})

watch(
  () => props.active,
  () => {
    if (!props.active) {
      isOutsideClicked.value = false
    }

    if (!threadCardRef.value || !props.active) {
      return
    }

    const threadCardDomRect = threadCardRef.value.getBoundingClientRect()

    // handle horizontal scroll
    /**
     * 透過橫向滑動
     * 1. 避免 Thread Card 被 Sticker Drawer 遮擋
     * 2.
     */
    if (window.innerWidth - threadCardDomRect.right < RIGHT_OFFSET) {
      if (!props.horizontalScrollContainer) return
      const scrollContainerDomRect =
        props.horizontalScrollContainer.getBoundingClientRect()
      const scrollContainerHiddenLeft =
        scrollContainerDomRect.left - props.horizontalScrollContainer.scrollLeft
      const threadCardRightInScrollContainer =
        threadCardDomRect.right - scrollContainerHiddenLeft
      const targetLeft =
        threadCardRightInScrollContainer +
        RIGHT_OFFSET -
        scrollContainerDomRect.width
      props.horizontalScrollContainer.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      })
    }

    // handle vertical scroll
    if (
      !props.verticalScrollContainer?.instance ||
      !props.verticalScrollContainer?.rootElement
    ) {
      return
    }

    const rootElement = props.verticalScrollContainer.rootElement
    rootElement.style.scrollBehavior = 'smooth'
    props.verticalScrollContainer.instance.scroll(
      {
        el: threadCardRef.value,
        scroll: 'ifneeded',
        block: 'end',
        margin: { top: 10, bottom: 10 },
      },
      {}
    )
  },
  { immediate: true }
)

const participantMenuTree = computed(() => ({
  width: 'w-50',
  scrollAreaMaxHeight: 'max-h-45',
  blockList: [
    {
      menuList: props.thread.participantList.map((item) => ({
        title: item.name,
        thumbnail: item.avatar,
      })),
    },
  ],
}))

const handleClick = () => {
  if (props.active) {
    return
  }

  emit('active')
}

const handleMaterialClick = (
  event: MouseEvent,
  thread: DigitalThreadBase,
  openInNew: boolean
) => {
  if (thread.hasMaterialDeleted || thread.hasMaterialNoAccess) {
    return
  }

  event.stopPropagation()
  emit('materialClick', thread, openInNew)
}

defineExpose({ scrollTo })
</script>

<style scoped></style>
