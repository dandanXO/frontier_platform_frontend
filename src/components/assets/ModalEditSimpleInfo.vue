<template lang="pug">
modal-behavior(
  :header="`${material.materialNo} - ${title}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="updateMaterial"
  @click:secondary="closeModal"
)
  div(class="min-w-200")
    simple-inventory(v-if="blockId === 'inventory'" :validations="validations")
    simple-price(v-else-if="blockId === 'price'" :validations="validations")
    simple-spec(v-else-if="blockId === 'spec'" :validations="validations")
    simple-tag(v-else-if="blockId === 'tag'" :validations="validations")
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useMaterialValidation from '@/composables/useMaterialValidation'
import SimpleInventory from '@/components/assets/SimpleInventory.vue'
import SimplePrice from '@/components/assets/SimplePrice.vue'
import SimpleSpec from '@/components/assets/SimpleSpec.vue'
import SimpleTag from '@/components/assets/SimpleTag.vue'

defineProps({
  blockId: {
    type: String
  },
  title: {
    type: String
  }
})

const store = useStore()
const { validations, validate } = useMaterialValidation()
const material = computed(() => store.getters['assets/material'])

const updateMaterial = async () => {
  if (validate()) {
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterial')
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
}

const closeModal = () => store.dispatch('helper/closeModal')

await store.dispatch('assets/getMaterialOptions')
</script>
