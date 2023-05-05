<template lang="pug">
modal-behavior(
  :header="$t('OO0002')"
  :primaryBtnText="$t('UU0021')"
  :primaryBtnDisabled="!availableToConfirm"
  :secondaryBtnText="$t('UU0026')"
  @click:primary="primaryHandler"
  @click:secondary="closeModalBehavior"
)
  div(class="w-117.5")
    div(class="w-full h-95 border border-grey-250 rounded overflow-hidden")
      div(class="h-13 grid grid-cols-2 cursor-pointer")
        div(
          v-for="tab in tabList"
          class="text-body1 flex items-center justify-center"
          :class="[currentTab === tab.id ? 'font-bold text-grey-900' : 'text-grey-600 bg-grey-100']"
          @click="switchTab(tab.id)"
        ) {{ tab.name }}
      div(class="h-82 pt-7.5 px-7 pb-5 flex flex-col justify-between")
        div(class="grid grid-cols-2 gap-x-8")
          div(
            class="border border-grey-250 rounded flex flex-col items-center pt-7.5 px-7 pb-5"
          )
            f-circle-progress-bar(
              :size="80"
              :current="plan.quota.material.used"
              :max="plan.quota.material.max"
            )
              div(class="text-caption font-normal text-grey-900 text-center")
                p {{ ((plan.quota.material.used / plan.quota.material.max) * 100).toFixed(0) }}%
                p {{ $t('OO0005') }}
            p(class="text-body2 text-grey-900 pt-5 pb-1.5") {{ $t('OO0002') }}:
            p(class="text-body2 text-grey-900 pb-3") {{ plan.quota.material.used }}/{{ plan.quota.material.max }} {{ $t('OO0006') }}
            label(
              class="bg-primary-400 opacity-70 w-full h-5.5 flex items-center justify-center rounded text-body2 text-grey-0"
            ) {{ planName }}
          div(class="flex flex-col")
            p(class="text-body2 text-grey-900 pt-2.5 pb-5") {{ currentTab === TAB.ADD ? $t('OO0047') : $t('OO0061') }}:
            div(class="flex")
              div(
                class="w-30 h-12 border rounded flex items-center justify-center text-body1 text-grey-900"
                :class="[isHitUpgradeAlert || !!cancelErrorMsg ? 'border-red-400' : 'border-grey-250']"
              ) {{ currentTab === TAB.ADD ? previewAmount : `-${previewAmount}` }}
              div(class="cursor-pointer")
                f-svg-icon(iconName="keyboard_arrow_up" size="24" @click="add")
                f-svg-icon(
                  iconName="keyboard_arrow_down"
                  size="24"
                  :class="{ 'text-grey-150': setQty === 0 }"
                  @click="reduce"
                )
            p(class="text-body2 text-grey-900 pt-0.5")
              template(v-if="currentTab === TAB.ADD") {{ `${pricing.materialUnit}${$t('OO0035')} / ${$t('RR0044')} $${pricing.materialPrice}` }}
              template(v-else) {{ `${pricing.materialUnit}${$t('OO0035')} / ${$t('OO0104')}` }}
            template(v-if="currentTab === TAB.ADD && isHitUpgradeAlert")
              p(class="text-caption text-red-400 leading-1.6 pt-1") *{{ $t('WW0081') }}
              p(
                class="text-caption text-cyan-400 leading-1.6 underline cursor-pointer"
                @click="openModalChoosePlan"
              ) {{ $t('OO0115') }}
            template(v-if="currentTab === TAB.REMOVE")
              div(class="flex-grow")
                p(
                  v-if="!!cancelErrorMsg"
                  class="text-caption text-red-400 leading-1.6 pt-1"
                ) {{ cancelErrorMsg }}
              div(class="flex items-start text-grey-600")
                f-svg-icon(iconName="error_outline" size="14" class="mt-1")
                p(class="text-caption leading-1.6 pl-0.5") {{ $t('OO0062') }}
        div(v-if="currentTab === TAB.ADD" class="border-t border-grey-250 pt-3")
          p(class="text-body1 font-bold text-grey-900 text-right") {{ `${$t('OO0034')}: ${$t('RR0044')} $${totalPrice}` }}
</template>

<script setup>
import { ref, computed, shallowRef, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import usePlan from '@/composables/usePlan.js'
import { NOTIFY_TYPE } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const { openModalChoosePlan } = usePlan()
const TAB = {
  ADD: 0,
  REMOVE: 1,
}
const tabList = [
  {
    id: TAB.ADD,
    name: t('OO0045'),
  },
  {
    id: TAB.REMOVE,
    name: t('OO0046'),
  },
]

const currentTab = ref(TAB.ADD)
const plan = computed(() => store.getters['polling/plan'])
const planName = computed(() => store.getters['polling/planName'])
const planType = computed(() => store.getters['polling/planType'])
const pricing = computed(() => {
  return planType.value.BASIC
    ? store.getters['organization/pricing'].basic
    : store.getters['organization/pricing'].pro
})
const setQty = ref(0)
const previewAmount = computed(() => setQty.value * pricing.value.materialUnit)
const isHitUpgradeAlert = computed(
  () =>
    planType.value.BASIC &&
    previewAmount.value + plan.value.quota.material.max >
      pricing.value.materialUpgradeAlert
)
const cancelErrorMsg = computed(() => {
  if (currentTab.value === TAB.ADD) {
    return ''
  }

  const { used, max } = plan.value.quota.material
  const { materialUnit, materialFreeQuota } = pricing.value
  if (materialFreeQuota > max - setQty.value * materialUnit) {
    return t('WW0084')
  } else if (used > max - setQty.value * materialUnit) {
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

const switchTab = (tadId) => {
  currentTab.value = tadId
  setQty.value = 0
}

const add = () => {
  setQty.value++
}

const reduce = () => {
  setQty.value > 0 && setQty.value--
}

const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')

const primaryHandler = async () => {
  if (currentTab.value === TAB.ADD) {
    const { estimateCharging, periodDate } = await store.dispatch(
      'organization/getChargingOfPurchaseMaterial',
      { setQty: setQty.value }
    )
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-checkout-list',
      properties: {
        header: t('OO0047'),
        isChargeNow: false,
        checkoutItemList: [
          {
            title: `${previewAmount.value}${t('OO0035')}`,
            price: `$${estimateCharging}`,
            periodDate,
          },
        ],
        payHandler: async () => {
          store.dispatch('helper/pushModalLoading')
          await store.dispatch('organization/purchaseMaterial', {
            setQty: setQty.value,
          })
          store.dispatch('helper/closeModalLoading')

          store.dispatch('helper/openModalConfirm', {
            type: NOTIFY_TYPE.SUCCESS,
            header: t('OO0165'),
            primaryBtnText: t('UU0031'),
            contentComponent: shallowRef({
              render: () => {
                return h('div', { class: 'text-body2 leading-1.6' }, [
                  h('p', {}, t('OO0051')),
                  h('p', {}, t('OO0052', { date: plan.value.renewDate })),
                ])
              },
            }),
          })
        },
      },
    })
  } else {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('OO0168'),
      primaryBtnText: t('UU0001'),
      textBtnText: t('UU0026'),
      contentText: t('OO0169', { qty: previewAmount.value }),
      afterPrimaryBtnHandler: async () => {
        store.dispatch('helper/openModalLoading')
        await store.dispatch('organization/cancelMaterial', {
          setQty: setQty.value,
        })
        store.dispatch('helper/closeModalLoading')

        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.SUCCESS,
          header: t('OO0162'),
          primaryBtnText: t('UU0031'),
          contentComponent: shallowRef({
            render: () => {
              return h(
                'p',
                {
                  class: 'text-body2 leading-1.6',
                  style: 'white-space: pre-line;',
                },
                t('OO0063', { newline: '\n', date: plan.value.renewDate })
              )
            },
          }),
        })
      },
    })
  }
}
</script>
