<template lang="pug">
div(class="flex flex-col items-center")
  div(class="mt-13 mb-13.5")
    div(class="flex items-center mb-3")
      img(:src="org.logo" class="w-8 h-8 rounded-full mr-3")
      p(class="text-body2 text-grey-900") {{ org.orgName }}
    div(class="pl-11")
      f-input-select(
        v-model:selectValue="autoText"
        :dropdownMenuTree="autoTextMenuTree"
        :placeholder="$t('QQ0036')"
        class="w-82 mb-3"
        @update:selectValue="handleSelect"
      )
      div(class="flex items-end")
        f-input-textarea(
          v-model:textValue="text"
          :placeholder="$t('QQ0037')"
          class="w-134 mr-2"
          minHeight="min-h-20.5"
        )
        f-button(size="sm" :disabled="text === ''" @click="handleSubmit") {{ $t('UU0049') }}
  div(class="w-full border-t border-grey-100")
  f-scrollbar-container(class="h-90 mt-11.5 w-144 -mx-5 px-5")
    div(v-if="moodboardCommentList.length > 0" class="flex flex-col gap-7.5")
      div(v-for="comment in moodboardCommentList")
        div(class="flex items-center mb-3")
          img(:src="comment.logo" class="w-8 h-8 rounded-full mr-3")
          div
            p(class="text-body2 text-grey-900 mb-1.5") {{ comment.name }}
            p(class="text-caption text-grey-600") {{ comment.createDate }}
        div(class="pl-11 text-body2 text-grey-900 leading-1.6") {{ comment.comment }}
    i18n-t(
      v-else
      keypath="QQ0042"
      tag="p"
      class="text-body1 text-grey-600 leading-1.6 text-center whitespace-nowrap"
      scope="global"
    )
      template(#newline)
        br
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const AUTO_TEXT = {
  CUSTOM: 1,
  SAMPLE_CARD_INQUIRY: 2,
  SAMPLE_INQUIRY: 3,
  PRICE_INQUIRY: 4,
}

const props = defineProps({
  moodboardId: {
    type: Number,
    required: true,
  },
  offerId: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()

const text = ref('')
const autoText = ref(null)

const autoTextMenuTree = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: t('QQ0038'),
          selectValue: AUTO_TEXT.CUSTOM,
        },
        {
          title: t('QQ0039'),
          selectValue: AUTO_TEXT.SAMPLE_CARD_INQUIRY,
        },
        {
          title: t('QQ0040'),
          selectValue: AUTO_TEXT.SAMPLE_INQUIRY,
        },
        {
          title: t('QQ0041'),
          selectValue: AUTO_TEXT.PRICE_INQUIRY,
        },
      ],
    },
  ],
}))

const org = computed(() => store.getters['organization/organization'])
const moodboardCommentList = computed(
  () => store.getters['moodboard/moodboardCommentList']
)

const handleSelect = () => {
  switch (autoText.value) {
    case AUTO_TEXT.SAMPLE_CARD_INQUIRY:
      return (text.value = t('QQ0078'))
    case AUTO_TEXT.SAMPLE_INQUIRY:
      return (text.value = t('QQ0079'))
    case AUTO_TEXT.PRICE_INQUIRY:
      return (text.value = t('QQ0080'))
    default:
      text.value = ''
  }
}

const handleSubmit = async () => {
  await store.dispatch('moodboard/createMoodboardComment', {
    moodboardId: props.moodboardId,
    offerId: props.offerId,
    comment: text.value,
  })
  autoText.value = null
  text.value = ''
}
</script>
