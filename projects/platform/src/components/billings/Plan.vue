<template lang="pug">
div(class="w-195")
  p(class="text-body1 text-grey-900 mt-18.5 mb-5 flex") {{ $t('OO0008') }}
    span(v-if="!planType.ENT && planStatus.BUFFER" class="flex items-center pl-5")
      f-svg-icon(iconName="warning_amber_round" size="20" class="text-red-400")
      i18n-t(
        keypath="WW0088"
        tag="span"
        class="text-caption text-red-400 pl-1"
        scope="global"
      )
        template(#UU0082)
          span(class="text-cyan-400 cursor-pointer" @click="payLastMonthUnbilledInfo") {{ $t('UU0082') }}
  div(class="grid grid-cols-3 grid-rows-2 gap-3 h-78")
    div(
      class="col-span-3 border border-grey-250 rounded px-7.5 flex justify-between items-center"
    )
      div
        h5(class="font-bold text-h5 text-grey-900 mb-2") {{ planName }}
        p(class="text-caption text-grey-600") {{ $t('UU0081') }}
          span(v-if="plan.renewDate" class="text-grey-600") ・{{ $t('OO0044') }} {{ plan.renewDate }}
      f-button(
        v-if="!planType.ENT"
        size="lg"
        :disabled="!planStatus.ACTIVE"
        @click="openModalChoosePlan"
      ) {{ $t('UU0075') }}
    div(class="border border-grey-250 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between")
      div
        p(class="text-body1 font-bold text-grey-900 mb-1") {{ $t('OO0002') }}
        p(class="text-caption text-grey-600 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(
          class="text-body1 font-bold leading-1.6"
          :class="[isMaterialFull ? 'text-red-400' : 'text-primary-500']"
        ) {{ materialQuota.used }}/{{ materialQuota.isUnlimited ? $t('OO0173') : materialQuota.max }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0035') }}
      f-circle-progress-bar(
        class="self-end"
        :size="60"
        :current="materialQuota.used"
        :max="materialQuota.max"
        :primaryColor="planStatus.ACTIVE ? (isMaterialFull ? 'stroke-red-400' : 'stroke-primary-400') : 'stroke-grey-250'"
      )
        div(class="text-caption font-normal text-grey-900 text-center")
          p(:class="{ 'text-red-400': isMaterialFull }") {{ ((materialQuota.used / materialQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
    div(class="border border-grey-250 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between")
      div
        p(class="text-body1 font-bold text-grey-900 mb-1") {{ $t('OO0003') }}
        p(class="text-caption text-grey-600 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(
          class="text-body1 font-bold leading-1.6"
          :class="[isU3mFull ? 'text-red-400' : 'text-primary-500']"
        ) {{ u3mQuota.used }}/{{ u3mQuota.isUnlimited ? $t('OO0173') : u3mQuota.max }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0035') }}
      f-circle-progress-bar(
        class="self-end"
        :size="60"
        :current="u3mQuota.used"
        :max="u3mQuota.max"
        :primaryColor="planStatus.ACTIVE ? (isU3mFull ? 'stroke-red-400' : 'stroke-primary-400') : 'stroke-grey-250'"
      )
        div(class="text-caption font-normal text-grey-900 text-center")
          p(:class="{ 'text-red-400': isU3mFull }") {{ ((u3mQuota.used / u3mQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
    div(class="border border-grey-250 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between")
      div
        p(class="text-body1 font-bold text-grey-900 mb-1") {{ $t('OO0114') }}
        p(class="text-caption text-grey-600 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(class="text-body1 font-bold text-primary-500 leading-1.6") {{ planType.ENT ? `${memberQuota.used}/${memberQuota.max}` : memberQuota.used }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0031') }}
  template(v-if="!planType.ENT")
    p(
      v-if="planStatus.ACTIVE || planStatus.BUFFER"
      class="text-body2 text-cyan-400 text-right pt-3 cursor-pointer"
      @click="deactivateOrg"
    ) {{ $t('OO0007') }}
    div(
      v-else-if="planStatus.INACTIVE"
      class="w-full h-24 bg-grey-100 flex justify-between items-center pl-7.5 pr-10 rounded mt-6"
    )
      div
        h6(class="text-h6 text-grey-900 font-bold") {{ $t('OO0007') }}
        p(class="text-body2 text-grey-600 pt-2") {{ $t('OO0059') }}
      f-button(size="md" @click="activateOrg") {{ $t('OO0129') }}
  plan-value-added-service(v-if="hasNoValueAddedService")
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import usePlan from '@/composables/usePlan.js'
import PlanValueAddedService from '@/components/billings/PlanValueAddedService.vue'

const store = useStore()
const {
  openModalChoosePlan,
  // openModalManageMaterialQuota,
  // openModalPurchaseU3mQuota,
  deactivateOrg,
  activateOrg,
  payLastMonthUnbilledInfo,
} = usePlan()

const plan = computed(() => store.getters['polling/plan'])
const planName = computed(() => store.getters['polling/planName'])
const planStatus = computed(() => store.getters['polling/planStatus'])
const planType = computed(() => store.getters['polling/planType'])
const hasNoValueAddedService = computed(
  () => store.getters['polling/hasNoValueAddedService']
)
const materialQuota = computed(() => plan.value.quota.material)
const u3mQuota = computed(() => plan.value.quota.u3m)
const memberQuota = computed(() => plan.value.quota.member)
const isMaterialFull = computed(() => {
  const { used, max } = materialQuota.value
  return used === max
})
const isU3mFull = computed(() => {
  const { used, max } = u3mQuota.value
  return used === max
})
</script>
