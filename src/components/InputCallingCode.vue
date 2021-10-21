<template lang="pug">
input-text(v-model:textValue="innerTextValue" :class="[classWidth]" :size="size")
  template(#prependItem)
    div(class="h-full -ml-4 pr-3 flex")
      dropdown(
        v-model:value="inputCountryCode"
        :options="countryList"
        class="w-19"
        keyOptionValue="countryCode"
        @expand="isExpand = true"
        @collapse="isExpand = false"
      )
        template(#displayItem="{ option }")
          div(class="w-full pl-4 pr-3 border-r rounded-l flex justify-between items-center" :class="[size === 'lg' ? 'h-11' : 'h-9']")
            i(class="text-h4") {{getEmojiFlag(option.countryCode)}}
            svg-icon(
              iconName="arrow-down"
              size="20"
              class="transform"
              :class="[ isExpand ? '-rotate-90 text-black-500' :'rotate-90 text-black-650']"
            )
        template(#dropdownList="{ select, options, currentIndex }")
          div(class="absolute top-full transform translate-y-2 py-2 bg-black-0 border rounded border-primary-middle card-shadow" :class="[classWidth]")
            overlay-scrollbar-container(:class="[classMaxHeight]")
              div(
                v-for="(country, index) in options"
                class="h-9 pl-3 flex items-center"
                :class="[ index === currentIndex ? 'bg-black-200' : '']"
                @click="select($event, country)"
              )
                i(class="text-h4 mr-1.5") {{getEmojiFlag(country.countryCode)}}
                span(class="text-body2 text-primary mr-2") {{country.name}}
                span(class="text-body2 text-black-650") +{{country.phone}}
    span(v-if="innerTextValue !== ''" class="text-primary text-body1 pr-1") {{`(+${callingCode}) `}}
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
    countryCode: {
      type: String,
      required: true
    },
    textValue: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '340'
    },
    size: {
      type: String,
      default: 'lg'
    }
  },
  emits: ['update:textValue', 'update:countryCode'],
  setup (props, { emit }) {
    const store = useStore()
    const isExpand = ref(false)
    const classWidth = ref(`w-${Number(props.width) / 4}`)
    const classMaxHeight = ref(`max-h-${9 * props.maxLength}`)

    const countryList = computed(() => store.getters['code/countryList'])
    const inputCountryCode = computed({
      get: () => props.countryCode || countryList.value[0].countryCode,
      set: (v) => emit('update:countryCode', v)
    })
    const callingCode = computed(() => countryList.value.find(country => country.countryCode === inputCountryCode.value).phone)

    const innerTextValue = computed({
      get: () => props.textValue,
      set: (v) => emit('update:textValue', v)
    })

    return {
      countryList,
      classWidth,
      classMaxHeight,
      isExpand,
      inputCountryCode,
      callingCode,
      getEmojiFlag,
      innerTextValue
    }
  }
}
</script>
