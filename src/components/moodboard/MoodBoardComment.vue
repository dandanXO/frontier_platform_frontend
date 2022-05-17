<template lang="pug">
div(class="flex flex-col items-center")
  div(class="pt-13")
    div(class="flex items-center mb-3")
      img(:src="org.logo" class="w-8 h-8 rounded-full mr-3")
      p(class="text-body2 text-primary") {{ org.orgName }}
    div(class="pl-11")
      input-select(
        v-model:selectValue="autoText"
        :options="options"
        :placeholder="$t('QQ0036')"
        keyOptionDisplay="label"
        keyOptionValue="value"
        class="w-82 mb-3 z-10"
        @select="handleSelect"
      )
      div(class="flex items-end")
        input-textarea(
          v-model:textValue="text"
          :placeholder="$t('QQ0037')"
          class="w-134 mr-2"
          height="82"
        )
        btn(size="sm" @click="handleSubmit") {{ $t("UU0049") }}
  div(class="w-full border-t border-primary-thin mb-19.5 mt-13.5")
  div(v-if="moodboardCommentList.length > 0"  class="flex flex-col gap-7.5")
    div(v-for="comment in moodboardCommentList")
      div(class="flex items-center mb-3")
        img(:src="comment.logo" class="w-8 h-8 rounded-full mr-3")
        div
          p(class="text-body2 text-primary mb-1.5") {{ comment.name }}
          p(class="text-caption text-black-600") {{ $dayjs.unix(comment.createDate).fromNow() }}
      div(class="pl-11 text-body2 text-primary leading-1.6 w-126") {{ comment.comment }}
  i18n-t(v-else keypath="QQ0042" tag="p" class="text-body1 text-black-600 leading-1.6 text-center")
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
  PRICE_INQUIRY: 4
}

const { t } = useI18n()
const store = useStore()

const text = ref('')
const autoText = ref(null)

const options = [
  {
    label: t('QQ0038'),
    value: AUTO_TEXT.CUSTOM
  },
  {
    label: t('QQ0039'),
    value: AUTO_TEXT.SAMPLE_CARD_INQUIRY
  },
  {
    label: t('QQ0040'),
    value: AUTO_TEXT.SAMPLE_INQUIRY
  },
  {
    label: t('QQ0041'),
    value: AUTO_TEXT.PRICE_INQUIRY
  }
]

const org = computed(() => store.getters['organization/organization'])
const moodboardCommentList = computed(() => store.getters['moodboard/moodboardCommentList'])

const handleSelect = () => {
  switch (autoText.value) {
    case AUTO_TEXT.SAMPLE_CARD_INQUIRY:
      return text.value = t('QQ0078')
    case AUTO_TEXT.SAMPLE_INQUIRY:
      return text.value = t('QQ0079')
    case AUTO_TEXT.PRICE_INQUIRY:
      return text.value = t('QQ0080')
    default:
      text.value = ''
  }
}

const moodboard = computed(() => store.getters['moodboard/moodboard'])
const { moodboardId, properties: { myOfferId } } = moodboard.value

const handleSubmit = async () => {
  await store.dispatch('moodboard/createMoodboardComment', {
    moodboardId,
    offerId: myOfferId,
    comment: text.value
  })
  autoText.value = null
  text.value = ''
}

await store.dispatch('moodboard/getMoodboardComment', {
  moodboardId,
  offerId: myOfferId
})
</script>
