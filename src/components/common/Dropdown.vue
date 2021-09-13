<template lang="pug">
div(ref="rootElement" class="dropdown relative cursor-pointer" @click="isExpand ? collapse() : expand()")
  slot(name="displayItem"
    :isExpand="isExpand"
    :currentIndex="currentIndex"
    :option="options[currentIndex]"
  )
  slot(name="dropdownList"
    v-if="isExpand"
    :select="select"
    :options="options"
    :currentIndex="currentIndex"
  )
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'Dropdown',
  props: {
    options: {
      type: Array,
      required: true
    },
    keyOptionValue: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    closeAfterOutsideClick: {
      type: Boolean,
      default: true
    },
    closeAfterSelect: {
      type: Boolean,
      default: true
    }
  },
  emits: ['expand', 'collapse', 'update:value'],
  setup (props, { emit }) {
    const isExpand = ref(false)
    const rootElement = ref(null)

    const currentIndex = computed(() => props.options.findIndex(option => option[props.keyOptionValue] === props.value))

    const expand = () => {
      props.closeAfterOutsideClick && document.addEventListener('click', captureOutsideClick)
      isExpand.value = true
      emit('expand')
    }

    const collapse = () => {
      props.closeAfterOutsideClick && document.removeEventListener('click', captureOutsideClick)
      isExpand.value = false
      emit('collapse')
    }

    const captureOutsideClick = (e) => {
      if (e.target.closest('.dropdown') !== rootElement.value) {
        collapse()
      }
    }

    const select = (e, option) => {
      e.stopPropagation()

      emit('update:value', option[props.keyOptionValue])
      props.closeAfterSelect && collapse()
    }

    return {
      isExpand,
      currentIndex,
      expand,
      collapse,
      select,
      rootElement
    }
  }
}
</script>
