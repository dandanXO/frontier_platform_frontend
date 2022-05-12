<template lang="pug">
div(class="w-195")
  p(class="text-body1 text-primary mt-18.5 mb-5 flex") {{ $t('OO0008') }}
    span(v-if="!planType.ENT && planStatus.BUFFER" class="flex items-center pl-5")
      svg-icon(iconName="warning_amber_round" size="20" class="text-warn")
      i18n-t(keypath="WW0088" tag="span" class="text-caption text-warn pl-1")
        template(#UU0082)
          span(class="text-assist-blue cursor-pointer" @click="payLastMonthUnbilledInfo") {{ $t('UU0082') }}
  div(class="grid grid-cols-3 grid-rows-2 gap-3 h-78")
    div(class="col-span-3 border border-black-400 rounded px-7.5 flex justify-between items-center")
      div
        h5(class="font-bold text-h5 text-primary mb-2") {{ planName }}
        p(class="text-caption text-black-700") {{ $t('UU0081') }}
          span(v-if="plan.renewDate" class="text-black-700") ・{{ $t('OO0044') }} {{ plan.renewDate }}
      btn(v-if="!planType.ENT" size="lg" :disabled="!planStatus.ACTIVE" @click="openModalChoosePlan") {{ $t('UU0075') }}
    div(
      class="border border-black-400 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between"
      :class="[{ 'hover:bg-black-100 cursor-pointer': !planType.ENT && planStatus.ACTIVE }]"
      @click="openModalManageMaterialQuota"
    )
      div
        p(class="text-body1 font-bold text-primary mb-1") {{ $t('OO0002') }}
        p(class="text-caption text-black-700 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(class="text-body1 font-bold leading-1.6" :class="[isMaterialFull ? 'text-warn' : 'text-brand-dark']") {{ materialQuota.used }}/{{ materialQuota.max }} 
          span(class="text-caption font-normal pl-1") {{ $t('OO0035') }}
      circle-progress-bar(
        class="self-end"
        :size="60"
        :current="materialQuota.used"
        :max="materialQuota.max"
        :primaryColor="planStatus.ACTIVE ? isMaterialFull ? 'stroke-warn' : 'stroke-brand' : 'stroke-black-500'"
      )
        div(class="text-caption font-normal text-primary text-center")
          p(:class="{ 'text-warn': isMaterialFull }") {{ ((materialQuota.used / materialQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
    div(
      class="border border-black-400 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between"
      :class="[{ 'hover:bg-black-100 cursor-pointer': !planType.ENT && planStatus.ACTIVE }]"
      @click="openModalPurchaseU3mQuota"
    )
      div
        p(class="text-body1 font-bold text-primary mb-1") {{ $t('OO0003') }}
        p(class="text-caption text-black-700 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(class="text-body1 font-bold leading-1.6" :class="[isU3mFull ? 'text-warn' : 'text-brand-dark']") {{ u3mQuota.used }}/{{ u3mQuota.max }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0035') }}
      circle-progress-bar(
        class="self-end"
        :size="60"
        :current="u3mQuota.used"
        :max="u3mQuota.max"
        :primaryColor="planStatus.ACTIVE ? isU3mFull ? 'stroke-warn' : 'stroke-brand' : 'stroke-black-500'"
      )
        div(class="text-caption font-normal text-primary text-center")
          p(:class="{ 'text-warn': isU3mFull }") {{ ((u3mQuota.used / u3mQuota.max) * 100).toFixed(0) }}%
          p {{ $t('OO0005') }}
    div(class="border border-black-400 rounded pt-8 pr-3 pb-6 pl-7 flex justify-between")
      div
        p(class="text-body1 font-bold text-primary mb-1") {{ $t('OO0114') }}
        p(class="text-caption text-black-700 leading-1.6 mb-5") {{ $t('OO0137') }}
        p(class="text-body1 font-bold text-brand-dark leading-1.6") {{ planType.ENT ? `${memberQuota.used}/${memberQuota.max}` : memberQuota.used }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0031') }}
  template(v-if="!planType.ENT")
    p(v-if="planStatus.ACTIVE || planStatus.BUFFER" class="text-body2 text-assist-blue text-right pt-3 cursor-pointer" @click="openModalDeactivate") {{ $t('OO0007') }}
    div(v-else-if="planStatus.INACTIVE" class="w-full h-24 bg-black-200 flex justify-between items-center pl-7.5 pr-10 rounded mt-6")
      div
        h6(class="text-h6 text-primary font-bold") {{ $t('OO0007') }}
        p(class="text-body2 text-black-600 pt-2") {{ $t('OO0059') }}
      btn(size="md" @click="activateOrg") {{ $t('OO0129') }}
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import usePlan from '@/composables/usePlan.js'

export default {
  name: 'Plan',
  setup () {
    const store = useStore()
    const {
      openModalChoosePlan,
      openModalManageMaterialQuota,
      openModalPurchaseU3mQuota,
      openModalDeactivate,
      activateOrg,
      payLastMonthUnbilledInfo
    } = usePlan()

    const plan = computed(() => store.getters['polling/plan'])
    const planName = computed(() => store.getters['polling/planName'])
    const planStatus = computed(() => store.getters['polling/planStatus'])
    const planType = computed(() => store.getters['polling/planType'])
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

    return {
      plan,
      planName,
      planStatus,
      planType,
      openModalChoosePlan,
      openModalManageMaterialQuota,
      openModalPurchaseU3mQuota,
      openModalDeactivate,
      activateOrg,
      materialQuota,
      isMaterialFull,
      u3mQuota,
      isU3mFull,
      memberQuota,
      payLastMonthUnbilledInfo
    }
  }
}
</script>
