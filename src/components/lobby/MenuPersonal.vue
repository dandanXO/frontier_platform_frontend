<template lang="pug">
tooltip(
  placement="bottom-end"
  :showArrow="false"
  :manual="true"
  :offset="[0, 8]"
)
  template(#trigger="{ isActive }")
    div(class="flex items-center cursor-pointer")
      img(:src="require('@/assets/images/default_user.png')" class="rounded-full w-8 h-8 mr-1")
      svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-650 transform" :class="[ isActive ? 'rotate-180' : 'rotate-0' ]")
  template(#content)
    list(class="w-55")
      template(v-for="(block, index) in optionList")
        list-item(v-for="option in block" class="cursor-pointer" @click.stop="option.func && option.func()") {{option.name}}
        div(v-if="index !== optionList.length - 1" class="mx-2 my-1 h-px bg-black-400")
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
  name: 'MenuPersonal',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()

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
          name: t('RR0125'),
          func: openModal.bind(undefined, 'modal-privacy-policy')
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
      optionList,
      openModal
    }
  }
}
</script>
