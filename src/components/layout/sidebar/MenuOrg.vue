<template lang="pug">
div(class="h-18 pt-4 pr-6.5 pb-5 pl-4")
  div(class="flex items-center")
    img(:src="orgLogo" class="rounded-full w-9 h-9 mr-2")
    tooltip(
      placement='bottom-start'
      :manual='true'
      :showArrow='false'
      :offset='[0, 8]'
    )
      template(#trigger="{ isActive }")
        div(class="flex items-center flex-grow cursor-pointer")
          span(class="text-body1 text-primary font-bold max-w-27.5 truncate line-height-1.4") {{org.orgName}}
          svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-600")
      template(#content)
        list(class="w-70")
          div(class="h-18 px-7.5 flex items-center")
            img(:src="orgLogo" class="rounded-md w-12 h-12 mr-3.5")
            span(class="text-body1 text-primary font-bold") {{org.orgName}}
          div(class="mx-2 my-1 h-px bg-black-400")
          div(class="h-31.5 py-3 px-7.5")
            p(class="text-caption pb-2") {{$t('LL0001', { number: org.totalMemberQty })}}
            p(class="text-caption line-height-1.6 pb-2") {{$t('LL0002', { number: org.totalMaterialQty })}}
            p(class="text-caption line-height-1.6 pb-4") {{$t('LL0003', { number: org.totalU3MQty })}}
            button(class="rounded-full flex items-center justify-center bg-brand text-black-0 px-3.5 py-1 text-caption hover:bg-brand-dark")
              router-link-extending(to="/plan" target="_blank") {{$t('UU0064')}}
          div(class="mx-2 my-1 h-px bg-black-400")
          list-item(@click="$router.push('/')" class="cursor-pointer")
            p(class="pl-4.5") {{$t('RR0127')}}
    svg-icon(iconName="notification" class="text-black-700")
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'MenuOrg',
  setup () {
    const store = useStore()
    const org = computed(() => store.getters['organization/organization'])
    const orgLogo = computed(() => store.getters['organization/orgLogo'])
    return {
      org,
      orgLogo
    }
  }
}
</script>
