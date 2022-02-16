<template lang="pug">
div(class='grid gap-y-7.5 px-8 mb-7.5')
  input-chips(
    v-model:chips="material.publicTagList"
    :label="$t('RR0027')"
    :placeholder="$t('DD0018')"
    class="relative z-9"
  )
  input-container(:label="$t('RR0071')" class="relative z-9")
    input-chips(
      v-model:chips="material.aiTagList"
      :placeholder="$t('DD0018')"
    )
    p(class="absolute right-0 top-0 text-caption text-primary") {{$t('EE0036')}}
div(class="bg-black-100 px-7.5 py-7.5")
  h6(class="text-h6 text-black-600 font-bold mb-7.5") {{$t('DD0019')}}
  input-chips(
    v-model:chips="material.privateTagList"
    :label="$t('RR0028')"
    :placeholder="$t('DD0020')"
    class="relative z-8"
  )
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SimpleTag',
  props: {
    validations: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const material = computed(() => store.getters['assets/material'])

    watch(
      () => material.value,
      () => {
        store.commit('assets/UPDATE_material', material.value)
      },
      {
        deep: true
      }
    )

    return {
      material
    }
  }
}
</script>
