<template lang="pug">
f-input-container(:label="`${$t('RR0031')}`")
  div(class="flex flex-col gap-y-4")
    slot
    div(
      v-for="(field, index) in sampleCardsRemainingFields"
      :key="field.key"
      class="flex flex-row gap-x-3"
    )
      div(class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5")
        f-input-text(
          class="w-full"
          v-model:textValue="field.value.source"
          :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].source`]"
          :label="$t('MI0061')"
          :placeholder="$t('MI0092')"
        )
        f-input-text(
          class="w-58"
          v-model:textValue="field.value.qtyInPcs"
          :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].qtyInPcs`]"
          inputType="number"
          :label="$t('RR0037')"
          :placeholder="$t('MI0056')"
          :addOnRight="$t('RR0307')"
        )
        f-input-container(class="w-full" :label="`${$t('RR0036')}`")
          div(class="flex flex-row gap-x-3 w-full")
            f-input-text(
              class="flex-grow"
              v-model:textValue="field.value.shelf1"
              :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf1`]"
              :placeholder="$t('MI0093')"
            )
            f-input-text(
              class="flex-grow"
              v-model:textValue="field.value.shelf2"
              :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf2`]"
              :placeholder="$t('MI0093')"
            )
        f-input-text(
          class="w-full"
          v-model:textValue="field.value.location"
          :hintError="displayErrors[`internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].location`]"
          :label="$t('RR0032')"
          :placeholder="$t('MI0094')"
        )
      div(class="flex justify-center items-center")
        f-svg-icon(
          v-if="index === 0"
          class="text-grey-600 cursor-pointer"
          size="24"
          iconName="add_box"
          @click="pushSampleCardsRemainingField({ qtyInPcs: null, location: null, source: null, shelf1: null, shelf2: null })"
        )
        f-svg-icon(
          v-else
          class="text-grey-600 cursor-pointer"
          size="20"
          iconName="delete"
          @click="removeSampleCardsRemainingField(index)"
        )
</template>

<script setup lang="ts"></script>

<style scoped></style>
