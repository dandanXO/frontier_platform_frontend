<template lang="pug">
div(class="h-18 pt-4 pr-6.5 pb-5 pl-4")
  div(class="flex items-center")
    tooltip(
      class="flex-grow"
      placement="bottom-start"
      manual
      :showArrow="false"
      :offset="[30, 8]"
    )
      template(#trigger="{ isActive }")
        div(class="flex items-center cursor-pointer")
          img(:src="orgLogo" class="rounded-full w-9 h-9 mr-2")
          p(class="text-body1 text-primary font-bold max-w-27.5 truncate line-height-1.4") {{org.orgName}}
          svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-600")
      template(#content)
        list(class="w-70")
          div(class="h-18 px-7.5 flex items-center")
            img(:src="orgLogo" class="rounded-md w-12 h-12 mr-3.5")
            span(class="text-body1 text-primary font-bold line-clamp-2") {{org.orgName}}
          div(class="mx-2 my-1 h-px bg-black-400")
          list-item
            p(class="pl-4.5 font-bold text-body1 text-primary") {{planName}}
          div(class="mx-2 my-1 h-px bg-black-400")
          list-item(class="h-10")
            div(class="pl-4.5 w-full flex justify-between items-center")
              p(class="text-primary text-caption") {{$t('OO0002')}}: {{org.plan.quota.material.used}}/{{org.plan.quota.material.max}}
              button(
                v-permission="FUNC_ID.OPEN_MANAGE_MATERIAL_QUOTA"
                v-if="planStatus.ACTIVE && !isPlanEnterprise"
                class="rounded-full flex items-center justify-center bg-brand text-black-0 px-3.5 py-1 text-caption hover:bg-brand-dark"
                @click="openModalManageMaterialQuota"
              ) {{$t('UU0073')}}
          list-item(class="h-10")
            div(class="pl-4.5 w-full flex justify-between items-center")
              p(class="text-primary text-caption") {{$t('OO0003')}}: {{org.plan.quota.u3m.used}}/{{org.plan.quota.u3m.max}}
              button(
                v-permission="FUNC_ID.OPEN_PURCHASE_U3M"
                v-if="planStatus.ACTIVE && !isPlanEnterprise"
                class="rounded-full flex items-center justify-center bg-brand text-black-0 px-3.5 py-1 text-caption hover:bg-brand-dark"
                @click="openModalPurchaseU3mQuota"
              ) {{$t('UU0074')}}
          div(class="mx-2 my-1 h-px bg-black-400")
          list-item(v-permission="FUNC_ID.VISIT_BILLING_PAGE" @click="goToBillings" class="cursor-pointer")
            div(class="w-full flex justify-between items-center")
              p(class="pl-4.5") {{$t('OO0004')}}
              div(v-if="!planStatus.ACTIVE" class="flex items-center")
                p(class="text-body2 text-brand-dark font-bold pr-1") {{$t('OO0130')}}
                svg-icon(iconName="arrow_forward" class="text-brand-dark" size="14")
          list-item(@click="goToLobby" class="cursor-pointer")
            p(class="pl-4.5") {{$t('RR0127')}}
    tooltip(placement="bottom-start" manual :showArrow="false" @show="readNotification" @hide="isExpand = false")
      template(#trigger)
        div(class="relative cursor-pointer")
          svg-icon(iconName="notification" class="text-black-700")
          div(v-if="haveUnreadNotification" class="absolute top-0.5 right-px w-2 h-2 rounded-full border border-black-0 bg-warn")
      template(#content)
        div(class="w-75 rounded-md overflow-hidden")
          div(class="h-9 bg-black-50 flex items-center pl-5")
            p(class="text-body1 font-bold text-primary") {{$t('NN0001')}}
          overlay-scrollbar-container(class="max-h-127.5")
            div(class="divide-y divide-black-200 border-t border-b border-black-200")
              div(
                v-for="notification in notificationList"
                class="w-full relative px-7.5 py-2.5"
              )
                p(class="text-caption text-primary line-height-1.6 pb-1" v-html="notification.content")
                p(class="text-caption text-black-600") {{notification.formattedDate}}
                i(v-if="!notification.isRead" class="absolute top-4.5 left-3 w-2 h-2 rounded-full bg-brand")
          div(class="bg-black-50 flex justify-center items-center py-2 text-caption text-black-700 line-height-1.6 text-center")
            p(v-if="moreThan4Notification && !isExpand" class="w-full" @click.stop="isExpand = true") {{$t('NN0006')}}
            p(v-else class="px-10.5") {{$t('NN0005')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useNavigation from '@/composables/useNavigation.js'
import { PLAN_TYPE, FUNC_ID } from '@/utils/constants.js'

export default {
  name: 'MenuOrg',
  setup () {
    const store = useStore()
    const { goToBillings, goToLobby } = useNavigation()

    const isExpand = ref(false)

    const org = computed(() => store.getters['organization/organization'])
    const orgLogo = computed(() => store.getters['organization/orgLogo'])
    const planName = computed(() => store.getters['organization/planName'])
    const planStatus = computed(() => store.getters['organization/planStatus'])
    const isPlanEnterprise = computed(() => store.getters['organization/plan'].planType === PLAN_TYPE.ENT)
    const notificationList = computed(() => {
      return isExpand.value
        ? store.getters['user/orgUser/notificationList']
        : store.getters['user/orgUser/notificationList'].slice(0, 4)
    })
    const moreThan4Notification = computed(() => store.getters['user/orgUser/notificationList'].length > 4)
    const haveUnreadNotification = computed(() => notificationList.value.some(({ isRead }) => !isRead))

    const readNotification = () => {
      haveUnreadNotification.value && store.dispatch('user/orgUser/readNotification')
    }

    const openModalManageMaterialQuota = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-manage-material-quota'
      })
    }

    const openModalPurchaseU3mQuota = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-purchase-u3m-quota'
      })
    }

    return {
      org,
      orgLogo,
      notificationList,
      haveUnreadNotification,
      moreThan4Notification,
      readNotification,
      isExpand,
      goToBillings,
      goToLobby,
      planName,
      openModalManageMaterialQuota,
      openModalPurchaseU3mQuota,
      isPlanEnterprise,
      planStatus,
      FUNC_ID
    }
  }
}
</script>
