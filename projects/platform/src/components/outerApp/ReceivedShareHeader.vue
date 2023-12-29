<template lang="pug">
div(
  class="mx-auto w-full rwd-outer-external-container flex justify-between items-center h-16"
)
  template(v-if="shareInfo")
    div(ref="refLeft" class="flex items-center gap-x-3")
      p(class="hidden tablet:block text-body1 font-bold text-grey-900 pr-2.5") {{ $t('GG0032') }}
      f-avatar(:imageUrl="shareInfo.unitLogo" type="org" size="lg")
      p(class="hidden tablet:block text-body1 font-bold text-grey-900 pl-2.5") {{ shareInfo.unitName }}
    div(ref="refRight" class="flex items-center gap-x-6")
      template(v-if="!isCollapsed && !isMobile")
        dropdown-locale
        f-tooltip-standard(:tooltipMessage="$t('RR0056')")
          template(#slot:tooltip-trigger)
            f-svg-icon(
              iconName="content_copy"
              class="text-grey-600 hover:text-primary-400 cursor-pointer"
              size="24"
              @click="receivedShareClone([shareInfo.nodeId])"
            )
        div(class="relative cursor-pointer" @click="openModalShareMessage")
          f-svg-icon(iconName="chat" size="24" class="text-grey-600")
          div(
            v-if="haveMsgAndFirstRead"
            class="absolute -top-px -right-px w-2 h-2 rounded-full border border-grey-0 bg-red-400"
          )
        digital-thread-entrance(
          v-if="route.name === 'ReceivedShareMaterial' && material && drawerOpenFromLocationList"
          :material="material"
          :drawerOpenFromLocationList="drawerOpenFromLocationList"
        )
      f-popper(v-else @click.stop placement="top-end")
        template(#trigger)
          f-svg-icon(
            iconName="more_horiz"
            size="24"
            class="text-grey-600 hover:text-primary-400"
          )
        template(#content="{ collapsePopper }")
          f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
      f-button(
        size="md"
        :disabled="shareInfo.isClosed"
        @click="saveReceivedShare"
      ) {{ $t('UU0018') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import DropdownLocale from '@/components/common/DropdownLocale.vue'
import { useOuterStore } from '@/stores/outer'
import { storeToRefs } from 'pinia'
import type { MenuTree } from '@frontier/ui-component'
import { useI18n } from 'vue-i18n'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import { useRoute } from 'vue-router'
import { useBreakpoints } from '@frontier/lib'

const props = defineProps<{
  sharingKey: string
}>()

const { isMobile } = useBreakpoints()
const { locale, t } = useI18n()
const store = useStore()
const route = useRoute()
const outerStore = useOuterStore()
const { getReceivedShareInfo } = outerStore
const { shareInfo, material, nodeMeta } = storeToRefs(outerStore)
const { saveReceivedShare, receivedShareClone } = useReceivedShare()
const drawerOpenFromLocationList = computed(() =>
  nodeMeta.value?.locationList.map(({ name }) => name)
)

const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(
  () => shareInfo.value?.message && isFirstTime.value
)

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-share-message',
    properties: {
      message: shareInfo.value?.message,
    },
  })
}

const refLeft = ref<HTMLElement>()
const refRight = ref<HTMLElement>()
const isCollapsed = ref(false)

const menuTree = computed<MenuTree>(() => ({
  width: 'w-50',
  blockList: [
    {
      menuList: [
        {
          title: t('RR0137'),
          icon: 'public',
          blockList: [
            {
              menuList: [
                {
                  title: 'English',
                  selectValue: 'en-US',
                  clickHandler(menu) {
                    locale.value = menu.selectValue
                  },
                },
                {
                  title: '繁體中文',
                  selectValue: 'zh-TW',
                  clickHandler(menu) {
                    locale.value = menu.selectValue
                  },
                },
                {
                  title: '日本語',
                  selectValue: 'ja-JP',
                  clickHandler(menu) {
                    locale.value = menu.selectValue
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      menuList: [
        {
          title: t('RR0167'),
          icon: 'content_copy',
          clickHandler: () => {
            shareInfo.value && receivedShareClone([shareInfo.value.nodeId])
          },
        },
      ],
    },
    {
      menuList: [
        {
          title: t('RR0146'),
          icon: 'chat',
          clickHandler: openModalShareMessage,
        },
      ],
    },
    {
      menuList: [
        {
          title: t('RR0324'),
          icon: 'sticker_thread',
          clickHandler: () => {
            store.dispatch('sticker/preOpenStickerDrawer', {
              material: material.value,
              drawerOpenFromLocationList: drawerOpenFromLocationList.value,
            })
          },
        },
      ],
    },
  ],
}))

onMounted(async () => {
  await getReceivedShareInfo(props.sharingKey)

  const right = refLeft.value?.getBoundingClientRect().right ?? -1
  const left = refRight.value?.getBoundingClientRect().left ?? 0

  if (right >= left) {
    isCollapsed.value = true
  }
})
</script>
