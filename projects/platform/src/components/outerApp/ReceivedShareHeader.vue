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
      template(v-if="!isCollapsed")
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

const props = defineProps<{
  sharingKey: string
}>()

const { locale } = useI18n()
const store = useStore()

const outerStore = useOuterStore()
const { getReceivedShareInfo, setHasSelectedStickerAddFromOG } = outerStore
const { shareInfo, hasLogin, hasSelectedStickerAddFromOG } =
  storeToRefs(outerStore)
const { saveReceivedShare, receivedShareClone } = useReceivedShare()

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

const isStickerDrawerForLoginOpen = computed<boolean>(
  () => store.getters['sticker/isStickerDrawerForLoginOpen']
)

const refLeft = ref<HTMLElement>()
const refRight = ref<HTMLElement>()
const isCollapsed = ref(false)

const menuTree = computed<MenuTree>(() => ({
  width: 'w-50',
  blockList: [
    {
      menuList: [
        {
          title: 'Language',
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
          title: 'Copy',
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
          title: 'Message',
          icon: 'chat',
          clickHandler: openModalShareMessage,
        },
      ],
    },
    {
      menuList: [
        {
          title: 'Digital Thread™',
          icon: 'sticker_thread',
          clickHandler: () => {
            // store.dispatch('sticker/openStickerDrawer', {
            //   // materialId: ,
            //   drawerOpenFromLocationList:
            //     store.getters['sticker/drawerOpenFromLocationList'],
            //   drawerOpenFromLocationType:
            //     store.getters['sticker/drawerOpenFromLocationType'],
            // })
          },
        },
      ],
    },
  ],
}))

onMounted(async () => {
  await getReceivedShareInfo(props.sharingKey)

  if (!shareInfo.value) {
    return
  }

  if (
    hasLogin.value &&
    isStickerDrawerForLoginOpen.value &&
    !hasSelectedStickerAddFromOG.value
  ) {
    store.commit('sticker/SET_isStickerDrawerForLoginOpen', false)
    // 檢查是否有選擇過組織
    setTimeout(() => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-choose-sticker-add-from',
        properties: {
          actionHandler: async (orgNo: string) => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('organization/getOrg', { orgNo })
            setHasSelectedStickerAddFromOG(true)
            await Promise.all([
              store.dispatch('organization/orgUser/getOrgUser'),
              store.dispatch('sticker/openStickerDrawer', {
                materialId: store.getters['sticker/currentMaterialId'],
                drawerOpenFromLocationList:
                  store.getters['sticker/drawerOpenFromLocationList'],
                drawerOpenFromLocationType:
                  store.getters['sticker/drawerOpenFromLocationType'],
              }),
            ])
            store.dispatch('helper/closeModalLoading')
          },
        },
      })
    }, 0)
  }

  const right = refLeft.value?.getBoundingClientRect().right ?? -1
  const left = refRight.value?.getBoundingClientRect().left ?? 0
  if (right >= left) {
    isCollapsed.value = true
  }
})
</script>
