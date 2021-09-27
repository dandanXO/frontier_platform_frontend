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
    list(class="absolute top-full -left-1 transform translate-y-2.5 min-w-24")
      list-item(
        v-for="(option, index) in options"
        :class="{'bg-primary-thin': index === currentIndex }"
        @click="select($event, option)"
      ) {{option[keyOptionDisplay]}}
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
    keyOptionDisplay: {
      type: String,
      default: 'name'
    },
    keyOptionValue: {
      type: String,
      default: 'value'
    },
    value: {
      type: [String, Number]
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
  emits: ['expand', 'collapse', 'update:value', 'select'],
  setup (props, { emit }) {
    const isExpand = ref(false)
    const rootElement = ref(null)

    const isBindingValue = computed(() => props.value !== undefined)
    const currentIndex = computed(() => {
      return isBindingValue.value
        ? props.options.findIndex(option => option[props.keyOptionValue] === props.value)
        : -1
    })

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

      if (isBindingValue.value) {
        emit('update:value', option[props.keyOptionValue])
      }
      emit('select', option)
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
