<template lang="pug">
f-popper(:placement="placement" :offset="[0, 4]")
  template(#trigger="{ isExpand }")
    div(
      class="p-[5px] flex rounded-md border border-transparent hover:bg-grey-50 hover:drop-shadow-2 hover:ease-in hover:duration-100"
      :class="{ 'bg-grey-50 border-primary-300 ease-out duration-200': isExpand, 'pr-[7px]': itemList.length !== 1, 'flex-row-reverse': direction === 'rtl' }"
    )
      f-avatar(
        v-for="(item, index) in itemList.slice(0, 5)"
        :type="type"
        :size="size"
        :imageUrl="item.imageUrl"
        :labelColor="item?.labelColor"
        :class="{ '-ml-0.5 transform translate-x-0.5': itemList.length !== 1 }"
        :style="{ zIndex: itemList.length - index }"
      )
      div(
        v-if="itemList.length > 5"
        class="bg-grey-150 border border-grey-0 rounded-full overflow-hidden flex items-center justify-center -ml-0.5"
        :class="classSize"
      )
        span(class="text-caption2 text-grey-600") +{{ itemList.length > 104 ? 99 : itemList.length - 5 }}
  template(#content)
    f-contextual-menu(:menuTree="menuTree")
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'user', // user | org
  },
  // [{name, imageUrl, labelColor}]
  itemList: {
    type: Array,
    required: true,
  },
  size: {
    type: String,
    default: 'md', // only sm or md
  },
  placement: {
    type: String,
    default: 'bottom-start',
  },
  direction: {
    type: String,
    default: 'ltr',
    validator: (v) => ['ltr', 'rtl'].includes(v),
  },
})

const classSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-6 h-6'
    case 'md':
      return 'w-8 h-8'
  }
})

const menuTree = computed(() => ({
  width: 'w-50',
  scrollAreaMaxHeight: 'max-h-45',
  blockList: [
    {
      menuList: props.itemList.map((item) => ({
        title: item.name,
        thumbnail: item.imageUrl,
      })),
    },
  ],
}))
</script>

<script>
export default {
  name: 'FAvatarGroup',
}
</script>
