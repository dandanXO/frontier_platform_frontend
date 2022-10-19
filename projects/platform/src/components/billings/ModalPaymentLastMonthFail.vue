<template lang="pug">
modal-behavior(
  :header="$t('OO0142')"
  :primaryBtnText="orgUserRole.OWNER || orgUserRole.ADMIN ? $t('UU0082') : $t('UU0026')"
  @click:primary="orgUserRole.OWNER || orgUserRole.ADMIN ? payLastMonthUnbilledInfo() : closeModal()"
)
  div(class="w-84")
    p(class="text-body2 leading-1.6 text-grey-900 mb-5") {{ $t('OO0143', { date: bufferDeactivatedDate }) }}
    i18n-t(v-if="orgUserRole.OWNER || orgUserRole.ADMIN" keypath="OO0144" tag="p" class="text-body2 leading-1.6 text-grey-900" scope="global")
      template(#RR0139)
        span(class="text-cyan-400") {{ $t('RR0139') }}
    p(v-else class="text-body2 leading-1.6 text-grey-900") {{ $t('OO0150') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import usePlan from '@/composables/usePlan'

const store = useStore()
const { payLastMonthUnbilledInfo } = usePlan()

const orgUserRole = computed(() => store.getters['organization/orgUser/orgUserRole'])
const bufferDeactivatedDate = computed(() => store.getters['polling/plan'].bufferDeactivatedDate)

const closeModal = () => store.dispatch('helper/closeModal')
</script>
