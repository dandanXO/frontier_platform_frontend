<template lang="pug">
div(class="h-full")
  //- Upper Part
  div
    p {{ $route.name }}
    btn(size="sm" @click="openCreateOrEditMoodboard") Edit
  //- Lower Part
  div(class="h-242.5 pt-16 pb-6.5 px-8 bg-black-50 flex flex-col")
    div(class="pl-31 pb-13.5")
      h5(class="text-h5 font-bold text-primary pb-3") {{ $t('QQ0016') }}
      p(class="text-body2 text-black-500") {{ $t('QQ0017') }}
    div(class="flex-grow flex gap-x-5.5")
      div(class="w-52 h-full")
        btn(size="md" prependIcon="add" class="w-full" @click="openModalMoodboardShareList") {{ $t('UU0096') }}
      div(class="flex-grow bg-black-0 border-primary-middle border rounded h-full")
</template>

<script setup>
import { useStore } from 'vuex'

const props = defineProps({
  moodboardId: {
    type: Number,
    required: true
  }
})

const store = useStore()

const openCreateOrEditMoodboard = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-or-edit-moodboard',
    properties: {
      mode: 2
    }
  })
}

const openModalMoodboardShareList = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-moodboard-share-list',
  })
}

await store.dispatch('moodboard/getMoodboard', { moodboardId: props.moodboardId })
</script>
