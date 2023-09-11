<template lang="pug">
div(class="w-25")
  div(
    class="group aspect-square relative w-25 h-25 rounded overflow-hidden border border-grey-300 hover:border-4 hover:border-grey-250"
    @click="openModalFileViewer"
  )
    div(class="group-hover:visible invisible z-1 absolute inset-0 bg-grey-900/40")
    f-svg-icon(
      iconName="open_in_full"
      size="20"
      class="group-hover:visible invisible z-2 absolute top-2 left-2 text-grey-0 cursor-pointer"
    )
    img(
      v-if="[PNG, JPEG, JPG, PDF].includes(file.extension)"
      :src="file.displayUrl"
      class="w-full h-full object-contain"
    )
    div(
      v-else-if="[GIF, MOV, MP4].includes(file.extension)"
      class="relative flex justify-center items-center w-full h-full"
    )
      video(class="w-full h-full object-contain")
        source(:src="file.originalUrl" type="video/mp4")
      div(
        class="absolute w-16 h-16 rounded-full bg-grey-900/70 flex justify-center items-center"
      )
        f-svg-icon(iconName="play_arrow" size="40" class="text-grey-0")
    div(
      v-else-if="file.extension === ZIP"
      class="flex justify-center items-center w-full h-full bg-grey-250"
    )
      f-svg-icon(iconName="file_zip" size="40" class="text-grey-0")
    f-svg-icon(v-else iconName="file" size="50" class="text-grey-0")
  div(class="px-0.5 w-full h-6 flex items-center justify-between")
    div(class="w-full flex items-center text-body2 text-grey-900")
      p(class="line-clamp-1") {{ file.displayFileName }}
      //- p .{{ file.extension }}
    f-popper(class="cursor-pointer" placement="right-start")
      template(#trigger)
        f-tooltip-standard(:tooltipMessage="$t('RR0260')")
          template(#slot:tooltip-trigger)
            f-svg-icon(iconName="more_horiz" size="24" class="hover:text-primary-400")
      template(#content="{ collapsePopper }")
        f-contextual-menu(:menuTree="menuTree" @click:menu="collapsePopper")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { EXTENSION } from '@frontier/constants'
import type { MenuTree } from '@frontier/ui-component'
import { downloadDataURLFile } from '@frontier/lib'
import type { AttachmentFile } from '@frontier/platform-web-sdk'

const { PNG, JPEG, JPG, GIF, MOV, MP4, ZIP, PDF } = EXTENSION

const props = withDefaults(
  defineProps<{
    file: AttachmentFile
    isReadOnly: boolean
    renameHandler?: (file: AttachmentFile) => void
    removeHandler?: (file: AttachmentFile) => void
  }>(),
  {
    isReadOnly: false,
  }
)

const store = useStore()

const openModalFileViewer = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-file-viewer',
  })
}

const menuTree = computed<MenuTree>(() => {
  return {
    width: 'w-44',
    blockList: (() => {
      const list = [
        {
          menuList: [
            {
              title: 'Download',
              icon: 'download',
              clickHandler: () => {
                downloadDataURLFile(
                  props.file.originalUrl,
                  props.file.displayFileName
                )
              },
            },
            {
              title: 'Rename',
              icon: 'create',
              clickHandler: () => {
                props.renameHandler && props.renameHandler(props.file)
              },
            },
          ],
        },
        {
          menuList: [
            {
              title: 'Delete',
              icon: 'delete',
              clickHandler: () => {
                props.removeHandler && props.removeHandler(props.file)
              },
            },
          ],
        },
      ]
      if (props.file.extension === PDF) {
        list[0].menuList.unshift({
          title: 'Open new page',
          icon: 'open_in_new',
          clickHandler: () => {
            window.open(props.file.originalUrl, '_blank')
          },
        })
      }
      return list
    })(),
  }
})
</script>
