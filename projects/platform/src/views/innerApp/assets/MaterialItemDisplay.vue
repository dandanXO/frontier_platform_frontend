<template>
  <div
    v-if="!isEditing"
    @click="startEdit"
    class="rounded text-grey-900-v1 flex h-[64px] w-[568px] items-center gap-2 cursor-pointer bg-white p-3 text-2xl font-bold leading-8 border border-grey-200-v1"
  >
    {{ itemNo }}
  </div>
  <input
    v-else
    ref="inputField"
    type="text"
    v-model="editableValue"
    @blur="saveEdit"
    @keydown.enter="saveEdit"
    class="rounded text-grey-900-v1 flex h-[64px] w-[568px] items-center gap-2 bg-white p-3 text-2xl font-bold leading-8 border border-grey-200-v1"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MaterialItemDisplay',
  props: {
    itemNo: {
      type: String,
      default: '',
    },
  },
  emits: ['update:itemNo'],
  data() {
    return {
      isEditing: false,
      editableValue: this.itemNo,
    }
  },
  watch: {
    itemNo(newValue: string) {
      if (!this.isEditing) {
        this.editableValue = newValue
      }
    },
  },
  methods: {
    startEdit() {
      this.editableValue = this.itemNo // Ensure we start editing with the current prop value
      this.isEditing = true
      this.$nextTick(() => {
        const inputField = this.$refs.inputField as HTMLInputElement
        if (inputField) {
          inputField.focus()
          inputField.select() // Select text for easy replacement
        }
      })
    },
    saveEdit() {
      if (!this.isEditing) {
        return // Prevent saving if not in editing mode (e.g. blur after enter)
      }
      this.isEditing = false
      if (this.editableValue !== this.itemNo) {
        this.$emit('update:itemNo', this.editableValue)
      }
    },
  },
})
</script>

<style scoped>
input {
  box-shadow: 0px 0px 0px 2px transparent;
  box-sizing: border-box;
}

input:focus {
  box-shadow: 0px 0px 0px 2px var(--Color-Utility-utility-cyan-200, #8addf4);
  outline: none;
}
</style>
