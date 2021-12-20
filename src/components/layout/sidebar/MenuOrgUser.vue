<template lang="pug">
div(class="h-13 bg-black-200 py-2.5 pl-4 pr-6")
  tooltip(
    placement="right-start"
    :showArrow="false"
    :manual="true"
    :offset="[-40, -60]"
    @click.stop
  )
    template(#trigger)
      div(class="w-50 flex items-center cursor-pointer")
        img(:src="avatar" class="rounded-full w-8 h-8 mr-2")
        p(class="flex-grow text-body2 text-primary line-clamp-1") {{orgUser.displayName}}
        svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-650")
    template(#content)
      list(class="w-55")
        template(v-for="(block, index) in optionList")
          list-item(v-for="option in block" class="cursor-pointer" @click.stop="option.func && option.func()") {{option.name}}
          div(v-if="index !== optionList.length - 1" class="mx-2 my-1 h-px bg-black-400")
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
  name: 'MenuOrgUser',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const orgUser = computed(() => store.getters['user/orgUser/orgUser'])
    const avatar = computed(() => store.getters['user/orgUser/avatar'])

    const openModal = (component, properties = {}) => {
      store.dispatch('helper/openModal', {
        component,
        properties
      })
    }

    const optionList = [
      [
        {
          name: t('RR0120'),
          func: openModal.bind(undefined, 'modal-personal-profile')
        },
        {
          name: t('RR0138'),
          func: openModal.bind(undefined, 'modal-change-password')
        }
      ],
      [
        {
          name: t('RR0137')
        },
        {
          name: t('RR0123')
        },
        {
          name: t('RR0124')
        }
      ],
      [
        {
          name: t('RR0125')
        }
      ],
      [
        {
          name: t('RR0126'),
          func: () => {
            router.push('/logout')
          }
        }
      ]
    ]

    return {
      orgUser,
      avatar,
      optionList,
      openModal
    }
  }
}
</script>
