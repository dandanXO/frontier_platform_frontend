<template lang="pug">
modal-behavior(
  :header="`${material.materialNo} - ${$t('RR0133')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="updateMaterialSimpleTag"
  @click:secondary="$store.dispatch('helper/closeModal')"
)
  div(class="min-w-200")
    div(class="grid gap-y-7.5 px-8 mb-7.5")
      f-input-chips(
        v-model:chips="material.publicTagList"
        :label="$t('RR0027')"
        :placeholder="$t('DD0018')"
      )
      div(class="relative")
        f-input-chips(
          v-model:chips="material.aiTagList"
          :label="$t('RR0071')"
          :placeholder="$t('DD0018')"
        )
        p(class="absolute right-0 top-0 text-caption text-grey-900") {{ $t("EE0036") }}
    div(class="bg-grey-50 px-7.5 py-7.5")
      h6(class="text-h6 text-grey-600 font-bold mb-7.5") {{ $t("DD0019") }}
      f-input-chips(
        v-model:chips="material.privateTagList"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
      )
</template>

<script setup>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import useMaterialValidation from '@/composables/useMaterialValidation'

const store = useStore()
const material = computed(() => store.getters['assets/material'])
const { validate } = useMaterialValidation(material)

watch(
  () => material.value,
  () => {
    store.commit('assets/UPDATE_material', material.value)
  },
  {
    deep: true
  }
)

const updateMaterialSimpleTag = async () => {
  if (!validate()) {
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterialSimpleTag')
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
}

await store.dispatch('assets/getMaterialOptions')
</script>
