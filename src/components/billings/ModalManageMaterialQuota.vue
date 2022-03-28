<template lang="pug">
div(class="w-133.5 px-8")
  div(class="w-full h-95 border border-black-400 rounded overflow-hidden")
    div(class="h-13 grid grid-cols-2 cursor-pointer")
      div(
        v-for="tab in tabList"
        class="text-body1 flex items-center justify-center"
        :class="[currentTab === tab.id ? 'font-bold text-primary' : 'text-black-600 bg-black-200']"
        @click="switchTab(tab.id)"
      ) {{ tab.name }}
    div(class="h-82 pt-7.5 px-7 pb-5 flex flex-col justify-between")
      div(class="grid grid-cols-2 gap-x-8")
        div(class="border border-black-400 rounded flex flex-col items-center pt-7.5 px-7 pb-5")
          circle-progress-bar(:size="80" :current="plan.quota.material.used" :max="plan.quota.material.max")
            div(class="text-caption font-normal text-primary text-center")
              p {{ ((plan.quota.material.used / plan.quota.material.max) * 100).toFixed(0) }}%
              p {{ $t('OO0005') }}
          p(class="text-body2 text-primary pt-5 pb-1.5") {{ $t('OO0002') }}:
          p(class="text-body2 text-primary pb-3") {{ plan.quota.material.used }}/{{ plan.quota.material.max }} {{ $t('OO0006') }}
          label(class="bg-brand opacity-70 w-full h-5.5 flex items-center justify-center rounded text-body2 text-black-0") {{ planName }}
        div(class="flex flex-col")
          p(class="text-body2 text-primary pt-2.5 pb-5") {{ currentTab === TAB.ADD ? $t('OO0047') : $t('OO0061') }}:
          div(class="flex")
            div(
              class="w-30 h-12 border  rounded flex items-center justify-center text-body1 text-primary"
              :class="[isHitUpgradeAlert || !!cancelErrorMsg ? 'border-warn' : 'border-black-400']"
            ) {{ previewAmount }}
            div(class="cursor-pointer")
              svg-icon(iconName="keyboard_arrow_up" size="24" @click="add")
              svg-icon(iconName="keyboard_arrow_down" size="24" :class="{ 'text-primary-middle': setQty === 0 }" @click="reduce")
          p(class="text-body2 text-primary pt-0.5")
            template(v-if="currentTab === TAB.ADD") {{ `${pricing.materialUnit}${$t('OO0035')} / ${$t('RR0044')} $${pricing.materialPrice}` }}
            template(v-else) {{ `${pricing.materialUnit}${$t('OO0035')} / ${$t('OO0156')}` }}
          template(v-if="currentTab === TAB.ADD && isHitUpgradeAlert")
            p(class="text-caption text-warn line-height-1.6 pt-1") *{{ $t('WW0081') }}
            p(class="text-caption text-assist-blue line-height-1.6 underline cursor-pointer" @click="openModalChoosePlan") {{ $t('OO0115') }}
          template(v-if="currentTab === TAB.REMOVE")
            div(class="flex-grow")
              p(v-if="!!cancelErrorMsg" class="text-caption text-warn line-height-1.6 pt-1") {{ cancelErrorMsg }}
            div(class="flex items-start text-black-600")
              svg-icon(iconName="error_outline" size="14" class="mt-1")
              p(class="text-caption line-height-1.6 pl-0.5") {{ $t('OO0062') }}
      div(v-if="currentTab === TAB.ADD" class="border-t border-black-400 pt-3")
        p(class="text-body1 font-bold text-primary text-right") {{ `${$t('OO0034')}: ${$t('RR0044')} $${totalPrice}` }}
  btn-group(
    class="h-25"
    :primaryButtonDisabled="!availableToConfirm"
    :primaryText="$t('UU0001')"
    @click:primary="primaryHandler"
    @click:secondary="closeModal"
  )
</template>

<script>
import { ref, computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import usePlan from '@/composables/usePlan.js'

export default {
  name: 'ModalManageMaterialQuota',
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const { openModalChoosePlan } = usePlan()
    const TAB = {
      ADD: 0,
      REMOVE: 1
    }
    const tabList = [
      {
        id: TAB.ADD,
        name: t('OO0045')
      },
      {
        id: TAB.REMOVE,
        name: t('OO0046')
      }
    ]

    const currentTab = ref(TAB.ADD)
    const plan = computed(() => store.getters['organization/plan'])
    const planName = computed(() => store.getters['organization/planName'])
    const planType = computed(() => store.getters['organization/planType'])
    const pricing = computed(() => {
      return planType.value.BASIC
        ? store.getters['organization/pricing'].basic
        : store.getters['organization/pricing'].pro
    })
    const setQty = ref(0)
    const previewAmount = computed(() => {
      return currentTab.value === TAB.ADD
        ? setQty.value * pricing.value.materialUnit
        : setQty.value * pricing.value.materialUnit * -1
    })
    const isHitUpgradeAlert = computed(() => planType.value.BASIC && (previewAmount.value + plan.value.quota.material.max) > pricing.value.materialUpgradeAlert)
    const cancelErrorMsg = computed(() => {
      if (currentTab.value === TAB.ADD) {
        return ''
      }

      const { used, max } = plan.value.quota.material
      const { materialUnit, materialFreeQuota } = pricing.value
      if (materialFreeQuota > max - (setQty.value * materialUnit)) {
        return t('WW0084')
      } else if (used > max - (setQty.value * materialUnit)) {
        return t('WW0083')
      }

      return ''
    })
    const totalPrice = computed(() => setQty.value * pricing.value.materialPrice)
    const availableToConfirm = computed(() => {
      if (currentTab.value === TAB.ADD) {
        return setQty.value !== 0 && !isHitUpgradeAlert.value
      } else {
        return setQty.value !== 0 && !cancelErrorMsg.value
      }
    })

    const switchTab = (tadId) => currentTab.value = tadId

    const add = () => {
      setQty.value++
    }

    const reduce = () => {
      setQty.value > 0 && setQty.value--
    }

    const closeModal = () => store.dispatch('helper/closeModal')

    const primaryHandler = async () => {
      store.dispatch('helper/pushModalLoading')
      let content

      if (currentTab.value === TAB.ADD) {
        await store.dispatch('organization/purchaseMaterial', { setQty: setQty.value })
        content = t('OO0051')
      } else {
        await store.dispatch('organization/cancelMaterial', { setQty: setQty.value })
        content = t('OO0063')
      }
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/openModal', {
        component: 'modal-payment-success',
        properties: {
          title: t('OO0050'),
          content,
          nextPayInfo: t('OO0052', { date: plan.value.renewDate }),
          buttonText: t('UU0026')
        }
      })
    }

    return {
      tabList,
      currentTab,
      switchTab,
      TAB,
      plan,
      planName,
      pricing,
      setQty,
      previewAmount,
      add,
      reduce,
      isHitUpgradeAlert,
      openModalChoosePlan,
      totalPrice,
      availableToConfirm,
      closeModal,
      primaryHandler,
      cancelErrorMsg
    }
  }
}
</script>
