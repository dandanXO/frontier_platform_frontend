<template lang="pug">
div(class="px-7.5 pt-7.5 w-full h-full")
  p(class="text-body1 font-bold text-primary mb-12.5") {{$t('OO0004')}}
  div(class="border-b border-black-400")
    div(class="flex gap-x-5")
      div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
        p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{tab.name}}
  div(class="w-full flex justify-center")
    plan(v-if="currentTab === 'plan'")
</template>

<script>
import { ref, computed, reactive, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ROLE_ID } from '@/utils/constants'

export default {
  name: 'Billings',
  components: {
    Plan: defineAsyncComponent(() => import('@/components/billings/Plan.vue'))
  },
  props: {
    tab: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const isLoading = ref(false)

    const currentTab = computed(() => props.tab)
    const tabList = reactive([
      {
        name: t('OO0009'),
        path: 'plan'
      },
      {
        name: t('OO0010'),
        path: 'payment'
      },
      {
        name: t('OO0011'),
        path: 'history'
      }
    ])

    const toggleTab = (tab) => {
      router.push({ name: route.name, params: { tab } })
    }

    return {
      currentTab,
      tabList,
      toggleTab,
      isLoading,
      ROLE_ID
    }
  }
}
</script>
