<template lang="pug">
modal-behavior(:header="$t('TT0067')")
  div(class="w-132 flex items-start gap-x-11.5")
    //-Left Side - Material Info
    div(class="sticky top-5 w-35 flex-shrink-0")
      //- Material Img
      div(
        class="relative w-27 h-27 rounded overflow-hidden flex items-center justify-center"
      )
        img(
          v-defaultImg
          :src="digitalThread.materialCoverImg"
          :class="{ 'opacity-20': digitalThread.hasMaterialDeleted || digitalThread.hasMaterialNoAccess }"
        )
        span(
          v-if="digitalThread.hasMaterialDeleted"
          class="absolute text-body1 font-bold text-grey-400"
        ) {{ $t('TT0112') }}
        span(
          v-else-if="digitalThread.hasMaterialNoAccess"
          class="absolute text-body1 font-bold text-grey-400"
        ) {{ $t('TT0107') }}
      //- Material No
      div(class="pt-7 pb-6")
        p(class="text-caption text-grey-500 pb-4") {{ $t('RR0257') }}
        p(class="text-caption text-grey-900 break-all") {{ digitalThread.materialNo }}
          span(v-if="digitalThread.hasMaterialDeleted") &nbsp({{ $t('TT0113') }})
          span(v-else-if="digitalThread.hasMaterialNoAccess") &nbsp({{ $t('TT0107') }})
      //- Material Owner
      div
        p(class="text-caption text-grey-500 pb-4") {{ $t('TT0056') }}
        div(class="flex items-start gap-x-2")
          f-avatar(
            :imageUrl="digitalThread.materialOwnerUnitLogo"
            type="org"
            size="xs"
          )
          p(class="text-caption text-grey-900 leading-1.6") {{ digitalThread.materialOwnerUnitName }}
    //- Right Side
    div(class="flex-grow flex flex-col gap-y-6")
      //-Digital Thread Name
      div
        p(class="text-caption text-grey-500 pb-2") {{ $t('TT0066') }}
        div(v-if="!isEditingDigitalThreadName" class="flex items-start")
          p(class="text-body1 font-bold text-grey-900 leading-1.6 break-all") {{ digitalThread.digitalThreadName }}
          f-svg-icon(
            iconName="create"
            size="20"
            class="ml-6 text-grey-600 hover:text-primary-400 cursor-pointer"
            :tooltip="$t('RR0054')"
            @click="openDigitalThreadNameEditor"
          )
        template(v-else)
          f-input-text(v-model:textValue="tempDigitalThreadName")
          div(class="flex items-center gap-x-2 pt-1.5")
            f-button(
              type="primary"
              size="sm"
              :disabled="!tempDigitalThreadName || tempDigitalThreadName === digitalThread.digitalThreadName"
              @click="saveDigitalThreadName"
            ) {{ $t('UU0018') }}
            f-button(
              type="text"
              size="sm"
              @click="isEditingDigitalThreadName = false"
            ) {{ $t('UU0002') }}
      //- Create From/By/Date
      div(class="flex flex-col gap-y-4")
        //- Create From
        div
          p(class="text-caption text-grey-500 pb-4") {{ $t('TT0061') }}
          div(class="flex items-center flex-wrap text-body2 text-grey-900 leading-1.6")
            template(v-for="(location, index) in addFromLocationList")
              p {{ location }}
              span(v-if="index !== addFromLocationList.length - 1" class="px-1") /
        //- Create By
        div
          p(class="text-caption text-grey-500 pb-4") {{ $t('TT0062') }}
          div(class="flex items-start gap-x-2")
            f-avatar(
              :imageUrl="digitalThread.creatorUnitLogo"
              :labelColor="digitalThread.isCreatorSide ? digitalThread.creatorUnitLabelColor : ''"
              type="org"
              size="sm"
            )
            p(
              class="text-caption text-grey-900 w-35 leading-1.6 line-clamp-4 break-all"
            ) {{ digitalThread.creatorUnitName }}
          div(v-if="digitalThread.isCreatorSide" class="pt-2 flex items-start gap-x-2")
            f-avatar(
              :imageUrl="digitalThread.creatorAvatar"
              type="org"
              size="sm"
            )
            p(
              class="text-caption text-grey-900 w-35 leading-1.6 line-clamp-4 break-all"
            ) {{ digitalThread.creator }}
        //- Create Date
        div
          p(class="text-caption text-grey-500 pb-4") {{ $t('TT0063') }}
          p(class="text-body2 text-grey-900") {{ $dayjs.unix(digitalThread.createDate).format('MMM DD, YYYY [at] hh:mm A') }}
      //- Sticker Statistics / Tags / Participants
      div(class="flex flex-col gap-y-2.5")
        //-  Sticker Statistics
        div(class="py-4 px-5 border border-grey-150 rounded")
          div(class="flex items-center pb-4")
            f-svg-icon(iconName="sticker" size="20" class="text-grey-900")
            span(class="text-grey-900 text0-body2 font-bold pl-2 pr-1") {{ $t('TT0057') }}
            span(class="text-caption text-grey-600") ({{ digitalThread.stickerStatistics.totalQty }})
          div
            div(
              class="flex items-center justify-between text-caption text-grey-900 pb-3 mb-3 border-b border-grey-150"
            )
              span {{ $t('TT0010') }}
              span(class="font-bold") {{ digitalThread.stickerStatistics.internalQty }}
            div(
              class="flex items-center justify-between text-caption text-grey-900 pb-3 mb-3 border-b border-grey-150"
            )
              span {{ $t('TT0009') }}
              span(class="font-bold") {{ digitalThread.stickerStatistics.externalQty }}
            div(class="flex items-center justify-between text-caption text-grey-900")
              span {{ $t('TT0019') }}
              span(class="font-bold") {{ digitalThread.stickerStatistics.starredQty }}
        //- Sticker Tags
        div(class="py-4 px-5 border border-grey-150 rounded")
          div(class="flex items-center pb-4")
            f-svg-icon(iconName="tag" size="20" class="text-grey-900")
            span(class="text-grey-900 text0-body2 font-bold pl-2 pr-1") {{ $t('TT0053') }}
            span(class="text-caption text-grey-600 pr-2") ({{ digitalThread.tagList.length }})
            f-svg-icon(
              iconName="internal"
              size="16"
              class="text-grey-300"
              :tooltip="$t('TT0101')"
            )
          div(class="flex items-center flex-wrap gap-x-2 gap-y-2")
            f-tag(v-for="tag in digitalThread.tagList" size="sm") {{ tag }}
        //- Participants
        div(class="py-4 px-5 border border-grey-150 rounded")
          div(class="flex items-center pb-4")
            f-svg-icon(iconName="management" size="20" class="text-grey-900")
            span(class="text-grey-900 text0-body2 font-bold pl-2 pr-1") {{ $t('TT0072') }}
            span(class="text-caption text-grey-600 pr-2") ({{ digitalThread.participantList.length }})
            f-svg-icon(
              iconName="internal"
              size="16"
              class="text-grey-300"
              :tooltip="$t('TT0101')"
            )
          div(class="flex flex-col gap-y-2")
            div(
              v-for="participant in digitalThread.participantList"
              class="flex items-center gap-x-2"
            )
              f-avatar(:imageUrl="participant.avatar" type="user" size="sm")
              span(class="text-caption leading-1.6 line-clamp-1 text-grey-900") {{ participant.name }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useAddFromDisplayList from '@/composables/useAddFromLocationListDisplay'

const store = useStore()

const digitalThread = computed(() => store.getters['sticker/digitalThread'])

const isEditingDigitalThreadName = ref(false)
const tempDigitalThreadName = ref('')
const openDigitalThreadNameEditor = () => {
  isEditingDigitalThreadName.value = true
  tempDigitalThreadName.value = digitalThread.value.digitalThreadName
}
const saveDigitalThreadName = () => {
  isEditingDigitalThreadName.value = false
  store.dispatch('sticker/updateDigitalThreadName', {
    digitalThreadName: tempDigitalThreadName.value,
  })
}

const addFromLocationList = useAddFromDisplayList(digitalThread)
</script>
