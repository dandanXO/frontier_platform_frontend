<template lang="pug">
div(class='grid gap-y-7.5 px-8 mb-7.5')
  input-chips(
    v-model:chips="material.publicTagList"
    :label="$t('RR0027')"
    :placeholder="$t('DD0018')"
    class="relative z-9"
  )
  input-chips(
    v-model:chips="material.aiTagList"
    :label="$t('RR0071')"
    :placeholder="$t('DD0018')"
    class="relative z-9"
  )
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
    const material = computed(() => store.getters['material/material'])

    watch(
      () => material.value,
      () => {
        store.commit('material/UPDATE_material', material.value)
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
