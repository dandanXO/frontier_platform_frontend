<template lang="pug">
f-popper(placement="bottom-end")
  template(#trigger="{ isExpand }")
    div(class="flex items-center cursor-pointer")
      img(src="@/assets/images/default_user.png" class="rounded-full w-8 h-8 mr-1")
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
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const store = useStore()
const router = useRouter()

const openModal = (component, properties = {}) => {
  store.dispatch('helper/openModalBehavior', {
    component,
    properties,
  })
}

const menuTree = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: t('RR0120'),
          clickHandler: openModal.bind(undefined, 'modal-personal-profile'),
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
          clickHandler: openModal.bind(undefined, 'modal-privacy-policy'),
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
