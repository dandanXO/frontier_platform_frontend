<template lang="pug">
div(class="w-195")
  p(class="text-body1 text-primary mt-18.5 mb-5") {{$t('OO0008')}}
  div(class="grid grid-cols-3 grid-rows-2 gap-3 h-73")
    div(class="col-span-3 border border-black-400 rounded pl-20 pr-10 flex items-center")
      div(class="relative w-full flex justify-between items-center")
        h6(class="font-bold text-h6 text-primary") {{planName}}
          span(class="text-body2 font-normal text-black-600 pl-3") ({{$t('UU0081')}})
        btn(v-if="!planType.ENT" size="lg" :disabled="!planStatus.ACTIVE" @click="openModalChoosePlan") {{$t('UU0075')}}
        p(v-if="plan.renewDate" class="absolute top-full text-body2 font-normal text-black-600") {{$t('OO0044')}} {{plan.renewDate}}
    div(class="border border-black-400 rounded pl-7.5 flex items-center gap-x-3")
      circle-progress-bar(:size="60" :current="plan.quota.material.used" :max="plan.quota.material.max" :primaryColor="planStatus.ACTIVE ? 'brand' : 'black-500'")
        div(class="text-caption font-normal text-primary text-center")
          p {{((plan.quota.material.used/plan.quota.material.max) * 100).toFixed(0)}}%
          p {{$t('OO0005')}}
      div
        p(class="text-body2 text-primary pb-1.5") {{$t('OO0002')}}:
        p(class="text-body2 text-black-700 pb-2.5") {{plan.quota.material.used}}/{{plan.quota.material.max}} {{$t('OO0006')}}
        button(
          v-if="!planType.ENT"
          class="rounded-full flex items-center justify-center bg-brand text-black-0 px-3.5 py-1 text-body2 hover:bg-brand-dark disabled:bg-black-200 disabled:text-black-500"
          :disabled="!planStatus.ACTIVE"
          @click="openModalManageMaterialQuota"
        ) {{$t('UU0073')}}
    div(class="border border-black-400 rounded pl-7.5 flex items-center gap-x-3")
      circle-progress-bar(:size="60" :current="plan.quota.u3m.used" :max="plan.quota.u3m.max" :primaryColor="planStatus.ACTIVE ? 'brand' : 'black-500'")
        div(class="text-caption font-normal text-primary text-center")
          p {{((plan.quota.u3m.used/plan.quota.u3m.max) * 100).toFixed(0)}}%
          p {{$t('OO0005')}}
      div
        p(class="text-body2 text-primary pb-1.5") {{$t('OO0003')}}:
        p(class="text-body2 text-black-700 pb-2.5") {{plan.quota.u3m.used}}/{{plan.quota.u3m.max}} {{$t('OO0006')}}
        button(
          v-if="!planType.ENT"
          class="rounded-full flex items-center justify-center bg-brand text-black-0 px-3.5 py-1 text-body2 hover:bg-brand-dark disabled:bg-black-200 disabled:text-black-500"
          :disabled="!planStatus.ACTIVE"
          @click="openModalPurchaseU3mQuota"
        ) {{$t('UU0074')}}
    div(class="border border-black-400 rounded flex justify-center items-center")
      p(class="text-body2 font-bold text-primary") {{$t('OO0031', { number: planType.ENT ? `${plan.quota.member.used}/${plan.quota.member.max}` : plan.quota.member.used })}}
  template(v-if="!planType.ENT")
    p(v-if="planStatus.ACTIVE" class="text-body2 text-assist-blue underline text-right pt-2 cursor-pointer" @click="openModalDeactivate") {{$t('OO0007')}}
    div(v-else class="w-full h-24 bg-black-200 flex justify-between items-center pl-7.5 pr-10 rounded mt-6")
      div
        h6(class="text-h6 text-primary font-bold") {{$t('OO0007')}}
        p(class="text-body2 text-black-600 pt-2") {{$t('OO0059')}}
      btn(size="md" @click="activateOrg") {{$t('OO0129')}}
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
      activateOrg
    } = usePlan()

    const plan = computed(() => store.getters['organization/plan'])
    const planName = computed(() => store.getters['organization/planName'])
    const planStatus = computed(() => store.getters['organization/planStatus'])
    const planType = computed(() => store.getters['organization/planType'])

    return {
      plan,
      planName,
      planStatus,
      planType,
      openModalChoosePlan,
      openModalManageMaterialQuota,
      openModalPurchaseU3mQuota,
      openModalDeactivate,
      activateOrg
    }
  }
}
</script>
