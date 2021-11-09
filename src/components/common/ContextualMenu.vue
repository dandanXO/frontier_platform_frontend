<template lang="pug">
list(class="min-w-57.5" @mouseleave="indexOfOnHover = -1")
  list-item(
    v-for="(option ,index) in optionList"
    class="justify-between relative cursor-pointer"
    :class="{ 'bg-black-200': multiSelect ? innerSelectValue.includes(option.value) : innerSelectValue === option.value }"
    @mouseenter="indexOfOnHover = index"
    @click.stop="select(option)"
  )
    p(class="pl-5") {{option.text}}
    template(v-if="option.subList && option.subList.length > 0")
      svg-icon(iconName="arrow-down" size="20" class="text-black-600")
      contextual-menu(
        v-show="indexOfOnHover === index"
        v-model:selectValue="innerSelectValue"
        :optionList="option.subList" class="absolute -top-2 left-px transform translate-x-full"
        @select="select($event)"
      )
    svg-icon(v-if="multiSelect ? innerSelectValue.includes(option.value) : innerSelectValue === option.value" iconName="done" size="20" class="text-brand")
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ContextualMenu',
  props: {
    selectValue: {
      required: true
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    optionList: {
      type: Array,
      required: true
    }
  },
  emits: ['update:selectValue', 'select'],
  setup (props, { emit }) {
    const indexOfOnHover = ref(-1)
    const indexListOfSelect = ref([])

    const innerSelectValue = computed({
      get: () => props.selectValue,
      set: (v) => emit('update:selectValue', v)
    })

    const select = (option) => {
      if (option.subList && option.subList.length > 0) {
        return
      }
      if (props.multiSelect) {
        const tempArr = [...props.selectValue]
        const index = tempArr.findIndex(tempItem => tempItem === option.value)

        if (!~index) {
          tempArr.push(option.value)
        } else {
          tempArr.splice(index, 1)
        }
        innerSelectValue.value = tempArr
      } else {
        if (innerSelectValue.value === option.value) {
          innerSelectValue.value = null
        } else {
          innerSelectValue.value = option.value
        }
      }
    }

    return {
      indexOfOnHover,
      indexListOfSelect,
      select,
      innerSelectValue
    }
  }
}
</script>
