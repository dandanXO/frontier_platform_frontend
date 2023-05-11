<template lang="pug">
div(class="h-18 pt-4 pr-6.5 pb-5 pl-4")
  div(class="flex items-center")
    f-popper(class="flex-grow" placement="bottom-start" :offset="[30, 8]")
      template(#trigger)
        div(class="flex items-center cursor-pointer")
          f-avatar(:imageUrl="orgLogo" type="org" size="lg" class="mr-2")
          p(
            class="text-body1 text-grey-900 font-bold max-w-26.5 truncate leading-1.4 cursor-pointer"
            data-cy="menu-org_name"
          ) {{ org.orgName }}
          f-svg-icon(iconName="keyboard_arrow_down" size="24" class="text-grey-600")
      template(#content="{ collapsePopper }")
        f-list(class="w-70")
          div(class="h-13 px-7.5 flex items-center")
            f-avatar(:imageUrl="orgLogo" type="org" size="lg" class="mr-3.5")
            span(class="text-body1 text-grey-900 font-bold line-clamp-2") {{ org.orgName }}
          div(class="mx-2 my-1 h-px bg-grey-250")
          f-list-item
            p(class="pl-4.5 font-bold text-body1 text-grey-900") {{ planName }}
          div(class="mx-2 my-1 h-px bg-grey-250")
          f-list-item(class="h-10")
            div(class="pl-4.5 w-full flex justify-between items-center")
              p(class="text-grey-900 text-caption") {{ $t('OO0002') }}: {{ plan.quota.material.used }}/{{ plan.quota.material.isUnlimited ? $t('OO0173') : plan.quota.material.max }}
              //- button(
              //-   v-permission="FUNC_ID.OPEN_MANAGE_MATERIAL_QUOTA"
              //-   v-if="planStatus.ACTIVE && !planType.ENT"
              //-   class="rounded-full flex items-center justify-center bg-primary-400 text-grey-0 px-3.5 py-1 text-caption hover:bg-primary-500"
              //-   @click="openModalManageMaterialQuota"
              //- ) {{ $t("UU0073") }}
          f-list-item(class="h-10")
            div(class="pl-4.5 w-full flex justify-between items-center")
              p(class="text-grey-900 text-caption") {{ $t('OO0003') }}: {{ plan.quota.u3m.used }}/{{ plan.quota.u3m.isUnlimited ? $t('OO0173') : plan.quota.u3m.max }}
              //- button(
              //-   v-permission="FUNC_ID.OPEN_PURCHASE_U3M"
              //-   v-if="planStatus.ACTIVE && !planType.ENT"
              //-   class="rounded-full flex items-center justify-center bg-primary-400 text-grey-0 px-3.5 py-1 text-caption hover:bg-primary-500"
              //-   @click="openModalPurchaseU3mQuota"
              //- ) {{ $t("UU0074") }}
          div(class="mx-2 my-1 h-px bg-grey-250")
          f-list-item(
            v-permission="FUNC_ID.VISIT_BILLING_PAGE"
            @click="goToBillings(); collapsePopper()"
            class="cursor-pointer"
          )
            div(class="w-full flex justify-between items-center")
              p(class="pl-4.5") {{ $t('OO0004') }}
              div(v-if="planStatus.INACTIVE" class="flex items-center")
                p(class="text-body2 text-primary-500 font-bold pr-1") {{ $t('OO0130') }}
                f-svg-icon(iconName="arrow_forward" class="text-primary-500" size="14")
          f-list-item(@click="goToLobby" class="cursor-pointer")
            p(class="pl-4.5") {{ $t('RR0127') }}
    f-popper(
      placement="bottom-start"
      @expand="readNotification"
      @collapse="isExpand = false"
    )
      template(#trigger)
        div(class="relative cursor-pointer")
          f-svg-icon(
            iconName="notification"
            class="text-grey-600"
            :tooltipMessage="$t('NN0001')"
          )
          div(
            v-if="haveUnreadNotification"
            class="absolute top-0.5 right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
          )
      template(#content)
        div(class="bg-grey-0 w-75 rounded-md overflow-hidden shadow-4")
          div(class="h-9 bg-grey-50 flex items-center pl-5")
            p(class="text-body1 font-bold text-grey-900") {{ $t('NN0001') }}
          f-scrollbar-container(class="max-h-127.5")
            div(class="divide-y divide-grey-100 border-t border-b border-grey-100")
              div(
                v-for="notification in notificationList"
                class="w-full relative px-7.5 py-2.5"
              )
                component(:is="notification.contentComponent")
                p(class="text-caption text-grey-600") {{ notification.formattedDate }}
                i(
                  v-if="!notification.isRead"
                  class="absolute top-4.5 left-3 w-2 h-2 rounded-full bg-primary-400"
                )
          div(
            class="bg-grey-50 flex justify-center items-center py-2 text-caption text-grey-600 leading-1.6 text-center"
          )
            p(
              v-if="moreThan4Notification && !isExpand"
              class="w-full cursor-pointer"
              @click.stop="isExpand = true"
            ) {{ $t('NN0006') }}
            p(v-else class="px-10.5") {{ $t('NN0005') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useNavigation from '@/composables/useNavigation.js'
// import usePlan from '@/composables/usePlan.js'
import { FUNC_ID } from '@/utils/constants'

const store = useStore()
const { goToBillings, goToLobby } = useNavigation()
// const { openModalManageMaterialQuota, openModalPurchaseU3mQuota } = usePlan()

const isExpand = ref(false)

const org = computed(() => store.getters['organization/organization'])
const orgLogo = computed(() => store.getters['organization/orgLogo'])
const plan = computed(() => store.getters['polling/plan'])
const planName = computed(() => store.getters['polling/planName'])
const planStatus = computed(() => store.getters['polling/planStatus'])
// const planType = computed(() => store.getters['polling/planType'])
const notificationList = computed(() => {
  return isExpand.value
    ? store.getters['polling/notificationList']
    : store.getters['polling/notificationList'].slice(0, 4)
})
const moreThan4Notification = computed(
  () => store.getters['polling/notificationList'].length > 4
)
const haveUnreadNotification = computed(() =>
  notificationList.value.some(({ isRead }) => !isRead)
)

const readNotification = () => {
  haveUnreadNotification.value &&
    store.dispatch('organization/orgUser/readNotification')
}
</script>
