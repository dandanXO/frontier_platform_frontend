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
  div(
    class="grid grid-rows-2 gap-3 h-78"
    :class="isFSTrialPlan ? 'grid-cols-3' : 'grid-cols-2'"
  )
    div(
      class="border border-grey-250 rounded px-7.5 flex justify-between items-center"
      :class="isFSTrialPlan ? 'col-span-3' : 'col-span-2'"
    )
      div
        h5(class="font-bold text-h5 text-grey-900 mb-2") {{ planName }}
        p(class="text-caption text-grey-600") {{ $t('UU0081') }}
          span(v-if="plan.renewDate" class="text-grey-600") ・{{ $t('OO0044') }} {{ plan.renewDate }}
          span(v-if="planType.DESIGNER && deactivatedDate" class="text-grey-600") ・{{ $t('OO0177') }} {{ deactivatedDate }}
      f-button(
        v-if="planType.BASIC || planType.PRO"
        size="lg"
        :disabled="!planStatus.ACTIVE"
        @click="openModalChoosePlan"
      ) {{ $t('UU0075') }}
    div(class="border border-grey-250 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between")
      div
        p(class="text-body1 font-bold text-grey-900 mb-1") {{ $t('OO0178') }}
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
        v-if="!materialQuota.isUnlimited"
        :primaryColor="planStatus.ACTIVE ? (isMaterialFull ? 'stroke-red-400' : 'stroke-primary-400') : 'stroke-grey-250'"
      )
        div(class="text-caption font-normal text-grey-900 text-center")
          p(:class="{ 'text-red-400': isMaterialFull }") {{ ((materialQuota.used / materialQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
    div(
      class="border border-grey-250 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between"
      v-if="isFSTrialPlan"
    )
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
        v-if="!u3mQuota.isUnlimited"
        :primaryColor="planStatus.ACTIVE ? (isU3mFull ? 'stroke-red-400' : 'stroke-primary-400') : 'stroke-grey-250'"
      )
        div(class="text-caption font-normal text-grey-900 text-center")
          p(:class="{ 'text-red-400': isU3mFull }") {{ ((u3mQuota.used / u3mQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
    div(class="border border-grey-250 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between")
      div
        p(class="text-body1 font-bold text-grey-900 mb-1") {{ $t('OO0155') }}
        p(class="text-caption text-grey-600 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(class="text-body1 font-bold text-primary-500 leading-1.6") {{ planType.ENT ? `${memberQuota.used}/${memberQuota.max}` : memberQuota.used }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0031') }}
      f-circle-progress-bar(
        class="self-end"
        :size="60"
        :current="memberQuota.used"
        :max="memberQuota.max"
        :primaryColor="planStatus.ACTIVE ? (isMemberFull ? 'stroke-red-400' : 'stroke-primary-400') : 'stroke-grey-250'"
      )
        div(class="text-caption font-normal text-grey-900 text-center")
          p(:class="{ 'text-red-400': iisMemberFull }") {{ ((memberQuota.used / memberQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
  template(v-if="planType.PRO")
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
  template(v-if="planType.DESIGNER && canCancelPlan")
    p(
      class="text-body2 text-cyan-400 text-right pt-3 cursor-pointer"
      @click="cancelDesignerPlan"
    ) {{ $t('RR0358') }}
  plan-value-added-service(v-if="hasNoValueAddedService")
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import usePlanOld from '@/composables/usePlanOld.js'
import usePlan from '@/composables/usePlan'
import PlanValueAddedService from '@/components/billings/PlanValueAddedService.vue'
import { U3M_QUOTA_FS_TRIAL } from '@/utils/constants'
const store = useStore()
const { openModalChoosePlan, deactivateOrg, payLastMonthUnbilledInfo } =
  usePlanOld()
const { cancelDesignerPlan } = usePlan()

const plan = computed(() => store.getters['polling/plan'])
const deactivatedDate = computed(() => store.getters['polling/deactivatedDate'])
const canCancelPlan = computed(() => store.getters['polling/canCancelPlan'])
const planName = computed(() => store.getters['polling/planName'])
const planStatus = computed(() => store.getters['polling/planStatus'])
const planType = computed(() => store.getters['polling/planType'])
const hasNoValueAddedService = computed(
  () => store.getters['polling/hasNoValueAddedService']
)
const materialQuota = computed(() => plan.value.quota.material)
const u3mQuota = computed(() => plan.value.quota.u3m)
const isFSTrialPlan = computed(() => u3mQuota.value.max === U3M_QUOTA_FS_TRIAL)
const memberQuota = computed(() => plan.value.quota.member)
const isMaterialFull = computed(() => {
  const { used, max } = materialQuota.value
  return used >= max
})
const isU3mFull = computed(() => {
  const { used, max } = u3mQuota.value
  return used >= max
})

const isMemberFull = computed(() => {
  const { used, max } = memberQuota.value
  return used >= max
})
</script>
