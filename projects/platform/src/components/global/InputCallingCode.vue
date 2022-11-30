<template lang="pug">
f-input-text(
  v-model:textValue="innerTextValue"
  :size="size"
  ref="refContainer"
  v-model:leftSelectValue="innerCountryCode"
  :leftDropdownOption="dropdownOption"
)
  template(#slot:left-dropdown-trigger)
    div(class="flex items-center")
      img(
        class="w-6 h-4 rounded-sm"
        :alt="innerCountryCode"
        :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${innerCountryCode}.svg`"
      )
      span(class="text-grey-600 text-body2 pl-1") {{ `(+${callingCode}) ` }}
</template>

<script>
export default {
  name: 'InputCallingCode',
}
</script>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
const store = useStore()

const emit = defineEmits(['update:textValue', 'update:countryCode'])
const props = defineProps({
  maxLength: {
    type: Number,
    default: 4,
  },
  countryCode: {
    validator: (v) => true,
    required: true,
  },
  textValue: {
    validator: (v) => true,
    required: true,
  },
  size: {
    type: String,
    default: 'lg',
  },
})

const refContainer = ref(null)

const countryList = computed(() => store.getters['code/countryList'])

const dropdownOption = computed(() => ({
  selectMode: CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL,
  menuTree: {
    searchEnable: true,
    width: 'w-85',
    scrollAreaMaxHeight: 'max-h-72',
    blockList: [
      {
        menuList: countryList.value.map((country) => ({
          title: country.name,
          description: `+${country.phone}`,
          selectValue: country.countryCode,
          flag: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.countryCode}.svg`,
        })),
      },
    ],
  },
}))

const innerCountryCode = computed({
  get: () => props.countryCode || countryList.value[0].countryCode,
  set: (v) => emit('update:countryCode', v),
})
const callingCode = computed(
  () =>
    countryList.value.find(
      (country) => country.countryCode === innerCountryCode.value
    ).phone
)

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v),
})
</script>
