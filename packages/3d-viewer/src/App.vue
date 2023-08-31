<template lang="pug">
model-editor(
  :dpi="u3m.dpi"
  :u3mPath="u3m.u3mSpecUrl"
  :baseImgUrl="u3m.baseImgUrl"
  :normalImgUrl="u3m.normalImgUrl"
  :roughImgUrl="u3m.roughImgUrl"
  :dispImgUrl="u3m.dispImgUrl"
)
</template>

<script setup lang="ts">
import ModelEditor from '@/components/ModelEditor.vue'
import materialResponse from '@/mock/materialResponse.json'

const u3m = materialResponse.material.u3m
</script>
