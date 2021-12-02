
<style lang="scss" scoped>
.sidebar-shadow {
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
}
</style>

<template lang="pug">
div(class="relative z-index:sidebar min-w-60 w-60 h-full bg-black-100 sidebar-shadow flex flex-col")
  div(class="h-18 pt-4 pr-6.5 pb-5 pl-4")
    div(class="flex items-center")
      img(:src="organization.logo" class="rounded-full w-9 h-9 mr-2")
      div(class="flex items-center flex-grow")
        span(class="text-body1 text-primary font-bold max-w-27.5 truncate line-height-1.4") {{organization.orgName}}
        svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-600")
      svg-icon(iconName="notification" class="text-black-700")
  div(class="border-t border-primary-thin px-1 py-1.5 flex flex-col")
    div(class="grid gap-y-1.5")
      sidebar-item(v-for="menu in menuGlobal.slice(0, 3)" v-bind="menu")
  div(class="flex-grow px-1 flex flex-col")
    div(class="w-auto h-px bg-primary-thin mx-1.5 my-1.5")
    overlay-scrollbar-container(class="flex-grow")
      div(class="grid gap-y-1.5")
        sidebar-item(v-bind="menuGlobal[3]")
        dropdown(v-for="item in menuOrgOrGroup" :options="item.menuList" :closeAfterSelect="false" :closeAfterOutsideClick="false")
          template(#displayItem="{ isExpand }")
            div(class="flex items-center h-9 pl-4 pr-5 hover:bg-black-400")
              label(class="w-3 h-3 rounded-sm mr-3" :style="{ 'background-color': item.labelColor }")
              span(class="flex-grow text-body2 text-primary truncate line-height-1.4") {{item.name}}
              svg-icon(iconName="keyboard_arrow_right" size="24" class="text-black-650 transform" :class="[ isExpand ? 'rotate-90' : 'rotate-0' ]")
          template(#dropdownList="{ options }")
            div(class="flex flex-col gap-y-0.5")
              sidebar-item(v-for="menu in options" v-bind="menu" class="relative")
                p(class="pl-7 text-body2 text-primary") {{$t(menu.title)}}
                template(v-if="menu.id === 'assets'")
                  div(class="absolute right-3 top-1/2 transform -translate-y-1/2 flex justify-center items-center w-6 h-6 rounded bg-primary-thin" @click.stop="$router.push(menu.path + '/upload')")
                    svg-icon(:iconName="menu.icon" size="20" class="text-black-800")
      div(class="w-auto h-px bg-primary-thin mx-1.5 my-1.5")
  div(class="h-13 bg-black-200 py-2.5 pl-4 pr-6")
    div(class="flex items-center")
      img(:src="orgUser.avatar" class="rounded-full w-8 h-8 mr-2")
      span(class="flex-grow text-body2 text-primary truncate line-height-1.4") {{orgUser.displayName}}
      svg-icon(iconName="keyboard_arrow_down" size="24" class="text-black-650")
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import SidebarItem from '@/components/layout/SidebarItem.vue'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  setup () {
    const store = useStore()
    const { t } = useI18n()

    const organization = computed(() => store.getters['organization/organization'])
    const orgUser = computed(() => store.getters['user/orgUser/orgUser'])
    const menuGlobal = computed(() => ([
      {
        id: 'publicLibrary',
        title: 'RR0003',
        icon: 'logo',
        path: `/${organization.value.orgNo}/public-library`
      },
      {
        id: 'globalSearch',
        title: 'RR0005',
        icon: 'search_all',
        path: `/${organization.value.orgNo}/global-search`
      },
      {
        id: 'favorites',
        title: 'RR0006',
        icon: 'favorite_border',
        path: `/${organization.value.orgNo}/favorites`
      },
      {
        id: 'management',
        title: 'RR0004',
        icon: 'member_setting',
        path: `/${organization.value.orgNo}/management/about`
      }
    ]))
    const menuOrgOrGroup = computed(() => {
      const { orgId, orgNo, labelColor } = organization.value
      return [
        {
          id: orgId,
          name: t('RR0007'),
          labelColor: labelColor,
          menuList: [
            {
              id: 'assets',
              title: 'RR0008',
              path: `/${orgNo}/assets`,
              icon: 'upload'
            },
            {
              id: 'workspace',
              title: 'RR0009',
              path: `/${orgNo}/workspace`
            },
            {
              id: 'shareToMe',
              title: 'RR0010',
              path: `/${orgNo}/share-to-me`
            },
            {
              id: 'sticker',
              title: 'RR0011',
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
                title: 'RR0008',
                path: `/${orgNo}/${groupId}/assets`,
                icon: 'upload'
              },
              {
                id: 'workspace',
                title: 'RR0009',
                path: `/${orgNo}/${groupId}/workspace`
              },
              {
                id: 'shareToMe',
                title: 'RR0010',
                path: `/${orgNo}/${groupId}/share-to-me`
              },
              {
                id: 'sticker',
                title: 'RR0011',
                path: `/${orgNo}/${groupId}/sticker`
              }
            ]
          }
        })
      ]
    })

    return {
      menuGlobal,
      organization,
      menuOrgOrGroup,
      orgUser
    }
  }
}
</script>
