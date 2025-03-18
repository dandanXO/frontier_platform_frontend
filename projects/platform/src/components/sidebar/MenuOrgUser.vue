<template lang="pug">
div(class="h-13 bg-grey-100 py-2.5 pl-4 pr-6")
  f-popper(placement="right-start" :offset="[-40, -60]")
    template(#trigger="{ isExpand }")
      div(class="w-50 flex items-center cursor-pointer")
        f-avatar(:imageUrl="avatar" size="md" class="mr-2")
        p(class="flex-grow text-body2 text-grey-900 line-clamp-1 cursor-pointer") {{ orgUser.displayName }}
        f-svg-icon(
          iconName="keyboard_arrow_down"
          size="24"
          class="text-grey-600 transform"
          :class="[isExpand ? 'rotate-180' : 'rotate-0']"
        )
    template(#content="{ collapsePopper }")
      f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PRAVICY_POLICY_URL } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const avatar = computed(() => store.getters['organization/orgUser/avatar'])

const openModal = (component, properties = {}) => {
  store.dispatch('helper/openModalBehavior', {
    component,
    properties,
  })
}

const openExternalLink = (url) => {
  window.open(url, '_blank')
}

const menuTree = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: t('RR0120'),
          clickHandler: openModal.bind(undefined, 'modal-org-user-profile'),
        },
        {
          title: t('RR0138'),
          clickHandler: openModal.bind(undefined, 'modal-change-password'),
        },
      ],
    },
    {
      menuList: [
        {
          title: t('RR0137'),
          clickHandler: openModal.bind(undefined, 'modal-change-locale'),
        },
        {
          title: t('RR0123'),
          clickHandler: openModal.bind(undefined, 'modal-send-feedback'),
        },
      ],
    },
    {
      menuList: [
        {
          title: t('RR0125'),
          clickHandler: () => openExternalLink(PRAVICY_POLICY_URL),
        },
      ],
    },
    {
      menuList: [
        {
          title: t('RR0126'),
          clickHandler: () => router.push('/logout'),
        },
      ],
    },
  ],
}))
</script>
