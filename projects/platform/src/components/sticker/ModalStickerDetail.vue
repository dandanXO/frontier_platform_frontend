<template lang="pug">
modal-behavior(:header="$t('TT0055')")
  div(class="w-132 flex items-start gap-x-11.5")
    //-Left Side - Material Info
    div(class="sticky top-5 w-35")
      //- Material Img
      img(v-defaultImg class="w-27 h-27 rounded" :src="digitalThread.materialCoverImg")
      //- Material No
      div(class="pt-7 pb-6")
        p(class="text-caption text-grey-500 pb-4") {{ $t('RR0200') }}
        p(class="text-caption text-grey-900") {{ `#${digitalThread.materialNo}` }}
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
      //- Sticker Info
      div(class="py-4 px-5 border border-grey-150 rounded")
        div(class="pb-4 flex items-center")
          f-svg-icon(iconName="sticker" size="20" class="text-grey-900")
          span(class="pl-2 text-body2 font-bold text-grey-900") {{ $t('TT0057') }}
        //- Add By
        div(class="border-b border-grey-150 pb-3 mb-3")
          p(class="text-caption text-grey-500 pb-4") {{ $t('TT0047') }}
          div(class="flex items-start gap-x-2")
            f-avatar(
              :imageUrl="sticker.creatorUnitLogo"
              :labelColor="digitalThread.isCreatorSide ? sticker.creatorUnitLabelColor : ''"
              type="org"
              size="sm"
            )
            p(
              class="text-caption text-grey-900 w-35 leading-1.6 line-clamp-4 break-all"
            ) {{ sticker.creatorUnitName }}
          div(v-if="digitalThread.isCreatorSide" class="pt-2 flex items-start gap-x-2")
            f-avatar(:imageUrl="sticker.creatorAvatar" type="org" size="sm")
            p(
              class="text-caption text-grey-900 w-35 leading-1.6 line-clamp-4 break-all"
            ) {{ sticker.creator }}
        //- add Date
        div
          p(class="text-caption text-grey-500 pb-4") {{ $t('TT0059') }}
          p(class="text-body2 text-grey-900") {{ $dayjs.unix(sticker.createDate).format('MMM DD, YYYY [at] hh:mm A') }}
      //- Digital Thread Info
      div(class="py-4 px-5 border border-grey-150 rounded")
        div(class="pb-4 flex items-center")
          f-svg-icon(iconName="sticker_thread" size="20" class="text-grey-900")
          span(class="pl-2 text-body2 font-bold text-grey-900") {{ $t('TT0060') }}
        //-Digital Thread Name
        p(
          class="text-body2 font-bold text-grey-900 leading-1.6 break-all border-b border-grey-150 pb-3 mb-3"
        ) {{ digitalThread.digitalThreadName }}
        //- Create From
        div(class="border-b border-grey-150 pb-3 mb-3")
          p(class="text-caption text-grey-500 pb-4") {{ $t('TT0061') }}
          div(class="flex items-center flex-wrap text-body2 text-grey-900 leading-1.6")
            template(v-for="(location, index) in addFromLocationList")
              p {{ location }}
              span(v-if="index !== addFromLocationList.length - 1" class="px-1") /
        //- Create By
        div(class="border-b border-grey-150 pb-3 mb-3")
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
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { LOCATION_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

const props = defineProps({
  sticker: {
    type: Object,
    required: true,
  },
})

const digitalThread = computed(() => store.getters['sticker/digitalThread'])

const addFromLocationList = computed(() => {
  const list = [...digitalThread.value.addFromLocationList]

  switch (digitalThread.value.addFromLocationType) {
    case LOCATION_TYPE.PUBLIC:
      list.unshift(t('RR0003'))
      break
    case LOCATION_TYPE.ASSETS:
      list.unshift(t('RR0008'))
      break
    case LOCATION_TYPE.WORKSPACE:
      list.unshift(t('RR0009'))
      break
    case LOCATION_TYPE.MOODBOARD:
      list.unshift(t('RR0003'))
      break
    case LOCATION_TYPE.SHARE_TO_ME:
      list.unshift(t('QQ0001'))
      break
    case LOCATION_TYPE.RECEIVED_SHARE:
      list.unshift(t('RR0256'))
      break
  }

  return list
})
</script>
