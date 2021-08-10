<template lang="pug">
div(class="w-full h-11 border-black-400 bg-black-0 flex")
  dropdown(
    v-model:value="inputCountryCode"
    :options="countryList"
    class="w-23"
    keyOptionValue="countryCode"
    @expand="isExpand = true"
    @collapse="isExpand = false"
  )
    template(#displayItem="{ option }")
      div(
        class="h-full absolute bg-black-0"
        :class="[ isExpand ? 'w-85 pl-2 pr-3 border-l border-t border-r rounded-t' : 'w-full px-2 border rounded-l']"
      )
        div(
          class="h-full flex justify-between items-center"
          :class="[isExpand ? 'border-b pl-3' : 'px-3']"
        )
          span(class="flex items-center")
            i(class="text-h4") {{getEmojiFlag(option.countryCode)}}
            span(v-if="isExpand" class="text-body2 text-primary ml-1.5 mr-2") {{option.name}}
            span(v-if="isExpand" class="text-body2 text-black-650") +{{option.phone}}
          svg-icon(
            iconName="arrow-down"
            size="24"
            class="transform"
            :class="[ isExpand ? '-rotate-90 text-black-500' :'rotate-90 text-black-650']"
          )
    template(#dropdownList="{ select, currentIndex }")
      div(
        class="absolute top-full w-85 overflow-y-auto pt-1.5 pb-3.5 px-2 bg-black-0 border-l border-r border-b rounded-b border-primary-middle"
        :class="[classMaxHeight]"
      )
        div(
          v-for="(country, index) in countryList"
          class="h-8.5 pl-3 flex items-center"
          :class="[ index === currentIndex ? 'bg-black-200 rounded' : '']"
          @click="select($event, country)"
        )
          i(class="text-h4 mr-1.5") {{getEmojiFlag(country.countryCode)}}
          span(class="text-body2 text-primary mr-2") {{country.name}}
          span(class="text-body2 text-black-650") +{{country.phone}}
  label(
    class="flex-grow h-full pl-3.5 flex items-center"
    :class="[isExpand ? '' : 'border-t border-r border-b rounded-r']"
  )
    span(v-if="value.length > 0" class="text-primary text-body1 pr-1") {{`(+${callingCode}) `}}
    input(
      type="text"
      :value="value"
      @input="typing"
      :placeholder="placeholder"
      class="flex-grow outline-none overflow-hidden placeholder-black-400 text-primary text-body1 placeholder-text-body2 bg-transparent"
      autocomplete
    )
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { getEmojiFlag } from 'countries-list'

export default {
  name: 'InputCallingCode',
  props: {
    maxLength: {
      type: Number,
      default: 4
    },
    value: {
      type: String,
      required: true
    },
    countryCode: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const store = useStore()
    const isExpand = ref(false)

    /**
     * 8.5: each option height
     * 5: padding top(1.5) + padding bottom(3.5)
     * 1: padding bottom(3.5) - option gap(2.5)
     */
    const classMaxHeight = ref(`max-h-${8.5 * props.maxLength - 1 + 5}`)

    const countryList = computed(() => store.getters['code/countryList'])
    const inputCountryCode = computed({
      get: () => props.countryCode,
      set: (v) => emit('update:countryCode', v)
    })
    const callingCode = computed(() => countryList.value.find(country => country.countryCode === inputCountryCode.value).phone)

    const typing = (e) => {
      emit('update:value', e.target.value)
    }

    return {
      countryList,
      classMaxHeight,
      isExpand,
      typing,
      inputCountryCode,
      callingCode,
      getEmojiFlag
    }
  }
}
</script>
