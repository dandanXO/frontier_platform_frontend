<template lang="pug">
div(class="flex items-center gap-x-3")
  template(v-if="length < 4")
    template(v-for="(item, index) in breadcrumbList" :key="index")
      p(:class="getItemClasses(index)" @click="$emit('click:item', item)") {{ item.name }}
      f-svg-icon(
        v-if="index !== length - 1"
        size="24"
        iconName="slash"
        class="text-grey-400-v1"
      )
  template(v-else)
    p(
      :class="getItemClasses(0)"
      @click="$emit('click:item', breadcrumbList[0])"
    ) {{ breadcrumbList[0].name }}
    f-svg-icon(size="20" iconName="slash" class="text-grey-250")
    f-popper(placement="bottom-start")
      template(#trigger="{ isExpand }")
        f-svg-icon(
          size="20"
          iconName="more_horiz"
          class="text-grey-900 hover:bg-grey-100 rounded-sm"
          :class="{ 'bg-grey-100': isExpand }"
        )
      template(#content)
        f-list
          f-list-item(
            v-for="item in breadcrumbList.slice(1, length - 1)"
            :key="item.name"
            @click="$emit('click:item', item)"
          ) {{ item.name }}
    f-svg-icon(size="20" iconName="slash" class="text-grey-250")
    p(:class="getItemClasses(length - 1)") {{ breadcrumbList[length - 1].name }}
</template>

<script>
export default {
  name: 'FBreadcrumb',
}
</script>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  /**
   * format:
   *
   * ```
   * [
   *  {
   *    name: String
   *    ...
   *  }
   * ]
   * ```
   */
  breadcrumbList: {
    type: Array,
    required: true,
  },
  fontSize: {
    type: String,
    default: 'text-body1',
  },
})

const length = computed(() => props.breadcrumbList.length)

const getItemClasses = (index) => {
  const isLastItem = index === length.value - 1
  const baseClasses = ['cursor-pointer', 'text-sm']

  if (isLastItem) {
    return [...baseClasses, 'font-bold', 'text-grey-900-v1']
  } else {
    return [
      ...baseClasses,
      'font-normal',
      'text-green-700',
      'hover:text-primary-400',
    ]
  }
}
</script>
