<template lang="pug">
div(class="px-6 pt-6.5 h-full flex flex-col")
  div(class="h-37 flex flex-col justify-between relative z-10")
    div(class="h-11 flex justify-between items-center")
      div(class="w-75")
        input-select(v-model:value="currentMenu" :options="menuOrgOrGroup" keyOptionDisplay="name" keyOptionValue="path" @select="toggleOrgOrGroup")
      div(class="flex gap-x-6")
        div(class="flex gap-x-1 items-center")
          svg-icon(iconName="add_box" size="20" class="text-brand")
          p(class="text-body2 text-primary") {{$t('b.createGroup')}}
        btn(size="sm" prependIcon="person_add") {{$t('b.invite')}}
    div(class="border-b border-black-400")
      div(class="flex gap-x-5 pl-3")
        div(v-for="tab in tabList" class="cursor-pointer" @click="toggleTab(tab.path)")
          p(class="pb-2 text-body1" :class="[tab.path === currentTab ? 'border-b-4 border-brand text-primary font-bold' : 'text-black-600' ]" ) {{$t(tab.name)}}
  router-view(class="flex-grow")
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Management',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const organization = computed(() => store.getters['organization/organization'])
    const menuOrgOrGroup = computed(() => {
      const { orgNo, orgName } = organization.value
      return [
        {
          name: orgName,
          path: `/${orgNo}/management/about`
        },
        ...store.getters['organization/groupList'].map(group => {
          const { groupId, groupName } = group
          return {
            name: groupName,
            path: `/${orgNo}/management/${groupId}/about`
          }
        })
      ]
    })
    const currentTab = computed(() => route.params.tab)
    const currentMenu = ref(decodeURI(route.path))
    const tabList = reactive([
      {
        name: 'b.about',
        path: 'about'
      },
      {
        name: 'b.member',
        path: 'members'
      },
      {
        name: 'b.history',
        path: 'history'
      }
    ])

    const toggleOrgOrGroup = (path) => {
      router.push(path)
    }

    const toggleTab = (tab) => {
      router.push({ name: route.name, params: { tab } })
    }

    return {
      currentMenu,
      menuOrgOrGroup,
      currentTab,
      tabList,
      toggleTab,
      toggleOrgOrGroup
    }
  }
}
</script>
