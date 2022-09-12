<template lang="pug">
f-input-text(v-model:textValue="innerTextValue" :size="size" ref="refContainer")
  template(#slot:prependItem)
    div(class="h-full -ml-4 pr-3 flex")
      f-popper(placement="bottom-start" @expand="expand")
        template(#trigger="{ isExpand }")
          div(class="w-19 pl-4 pr-3 border-r rounded-l flex justify-between items-center" :class="[size === 'lg' ? 'h-11' : 'h-9']")
            img(class="w-6 h-6 rounded" :alt="innerCountryCode" :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${innerCountryCode}.svg`")
            f-svg-icon(
              iconName="keyboard_arrow_right"
              size="20"
              class="transform"
              :class="[isExpand ? '-rotate-90 text-black-500' : 'rotate-90 text-black-650']"
            )
        template(#content)
          div(class="py-2 bg-black-0 border rounded border-primary-middle card-shadow" :style="{ width: contentWidth + 'px' }")
            f-scrollbar-container(:style="{ 'max-height': 36 * maxLength + 'px' }")
              div(
                v-for="country in countryList"
                class="h-9 pl-3 flex items-center cursor-pointer"
                :class="[country.countryCode === innerCountryCode ? 'bg-black-200' : '']"
                @click="innerCountryCode = country.countryCode"
              )
                img(class="w-6 h-6 rounded mr-1.5" :alt="country.countryCode" :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.countryCode}.svg`")
                span(class="text-body2 text-primary mr-2") {{ country.name }}
                span(class="text-body2 text-black-650") +{{ country.phone }}
    span(v-if="innerTextValue !== ''" class="text-primary text-body1 pr-1") {{ `(+${callingCode}) ` }}
</template>

<script>
export default {
  name: 'InputCallingCode'
}
</script>


<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'

const store = useStore()

const emit = defineEmits(['update:textValue', 'update:countryCode'])
const props = defineProps({
  maxLength: {
    type: Number,
    default: 4
  },
  countryCode: {
    validator: (v) => true,
    required: true
  },
  textValue: {
    validator: (v) => true,
    required: true
  },
  size: {
    type: String,
    default: 'lg'
  }
})

const refContainer = ref(null)
const contentWidth = ref(340)
const expand = () => {
  contentWidth.value = refContainer.value.$el.getBoundingClientRect().width
}

const countryList = computed(() => store.getters['code/countryList'])
const innerCountryCode = computed({
  get: () => props.countryCode || countryList.value[0].countryCode,
  set: (v) => emit('update:countryCode', v)
})
const callingCode = computed(() => countryList.value.find(country => country.countryCode === innerCountryCode.value).phone)

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v)
})
</script>
