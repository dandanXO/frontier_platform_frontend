<style lang="scss" scoped>
.sidebar-shadow {
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
}
</style>

<template lang="pug">
div(class="fixed z-20 w-60 h-full left-0 top-0 bottom-0 bg-black-100 sidebar-shadow flex flex-col")
  div(class="h-18 pt-4 pr-6.5 pb-5 pl-4")
    div(class="flex items-center")
      img(:src="organization.logo" class="rounded-full w-9 h-9 mr-2")
      div(class="flex items-center flex-grow")
        span(class="text-body1 text-primary font-bold max-w-27.5 truncate line-height-1.4") {{organization.orgName}}
        svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-600")
      svg-icon(iconName="notification" class="text-black-700")
  div(class="border-t border-primary-thin flex-grow p-2.5 flex flex-col")
    div(class="pb-2.5 mb-2.5 border-b border-primary-thin")
      div(class="grid gap-y-1.5 -mx-1.5")
        div(
          v-for="menu in menuGlobal"
          class="flex items-center gap-x-2 h-9 pl-3 pr-2 hover:bg-black-400"
          :class="[{ 'bg-black-500': $route.matched.some(route => route.name === menu.routeName) }]"
          @click="currentTab = menu.path, $router.push(menu.path)"
        )
          svg-icon(:iconName="menu.icon" class="text-black-700")
          span(class="text-body2 text-primary") {{$t(menu.title)}}
    overlay-scrollbar-container(class="flex-grow")
      div(v-for="item in menuOrgOrGroup" class="pb-2.5 mb-2.5 border-b border-primary-thin")
        div(class="-mx-1.5")
          dropdown(v-model:value="currentTab" :options="item.menuList" keyOptionValue="path" :closeAfterSelect="false" :closeAfterOutsideClick="false")
            template(#displayItem="{ isExpand }")
              div(class="flex items-center h-9 pl-4 pr-5 hover:bg-black-400")
                label(class="w-3 h-3 rounded-sm mr-3" :style="{ 'background-color': item.labelColor }")
                span(class="flex-grow text-body2 text-primary truncate line-height-1.4") {{item.name}}
                svg-icon(iconName="keyboard_arrow_right" size="24" class="text-black-650 transform" :class="[ isExpand ? 'rotate-90' : 'rotate-0' ]")
            template(#dropdownList="{ select }")
              div(class="flex flex-col gap-y-0.5" @click.stop)
                div(
                  v-for="menu in item.menuList"
                  class="flex items-center justify-between h-9 pl-10 pr-5 hover:bg-black-400"
                  :class="[{ 'bg-black-500': currentTab === menu.path }]"
                  @click="select($event, menu), $router.push(menu.path)"
                )
                  span(class="text-body2 text-primary") {{$t(menu.title)}}
                  template(v-if="menu.id === 'assets'")
                    div(class="flex justify-center items-center w-6 h-6 rounded bg-primary-thin")
                      svg-icon(:iconName="menu.icon" size="20" class="text-black-800")
  div(class="h-13 bg-black-200 py-2.5 pl-4 pr-6")
    div(class="flex items-center")
      img(:src="orgUser.avatar" class="rounded-full w-8 h-8 mr-2")
      span(class="flex-grow text-body2 text-primary truncate line-height-1.4") {{orgUser.displayName}}
      svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-650")
main(class="ml-60")
  router-view
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default {
  name: 'InnerAppLayout',
  setup () {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()

    const organization = computed(() => store.getters['organization/organization'])
    const user = computed(() => store.getters['user/user'])
    const orgUser = computed(() => store.getters['user/orgUser/orgUser'])

    const currentTab = ref(decodeURI(route.path))
    const menuGlobal = reactive([
      {
        id: 'publicLibrary',
        title: 'reuse.publicLibrary',
        icon: 'bookmark_border',
        routeName: 'PublicLibrary',
        path: `/${organization.value.orgNo}/public-library`
      },
      {
        id: 'management',
        title: 'reuse.management',
        icon: 'management',
        routeName: 'Management',
        path: `/${organization.value.orgNo}/management`
      },
      {
        id: 'globalSearch',
        title: 'reuse.globalSearch',
        icon: 'search_all',
        routeName: 'GlobalSearch',
        path: `/${organization.value.orgNo}/global-search`
      },
      {
        id: 'favorites',
        title: 'reuse.favorites',
        icon: 'favorite_border',
        routeName: 'Favorites',
        path: `/${organization.value.orgNo}/favorites`
      }
    ])
    const menuOrgOrGroup = computed(() => {
      const { orgId, orgNo, labelColor } = organization.value
      return [
        {
          id: orgId,
          name: t('reuse.organization'),
          labelColor: labelColor,
          menuList: [
            {
              id: 'assets',
              title: 'reuse.assets',
              path: `/${orgNo}/assets`,
              icon: 'upload'
            },
            {
              id: 'workspace',
              title: 'reuse.workspace',
              path: `/${orgNo}/workspace`
            },
            {
              id: 'shareToMe',
              title: 'reuse.shareToMe',
              path: `/${orgNo}/share-to-me`
            },
            {
              id: 'sticker',
              title: 'reuse.sticker',
              path: `/${orgNo}/sticker`
            }
          ]
        },
        ...store.getters['organization/groupList'].map(group => {
          const { groupId, groupName, labelColor } = group
          return {
            id: groupId,
            name: groupName,
            labelColor: labelColor,
            menuList: [
              {
                id: 'assets',
                title: 'reuse.assets',
                path: `/${orgNo}/${groupId}/assets`,
                icon: 'upload'
              },
              {
                id: 'workspace',
                title: 'reuse.workspace',
                path: `/${orgNo}/${groupId}/workspace`
              },
              {
                id: 'shareToMe',
                title: 'reuse.shareToMe',
                path: `/${orgNo}/${groupId}/share-to-me`
              },
              {
                id: 'sticker',
                title: 'reuse.sticker',
                path: `/${orgNo}/${groupId}/sticker`
              }
            ]
          }
        })
      ]
    })

    return {
      menuGlobal,
      currentTab,
      organization,
      menuOrgOrGroup,
      user,
      orgUser
    }
  }
}
</script>
