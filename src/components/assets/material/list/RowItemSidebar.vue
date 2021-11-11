<template lang="pug">
div(class='text-black-700 flex flex-col gap-3.5')
  tooltip(
    v-for='item in iconList'
    class="relative cursor-pointer"
    :placement="item.icon === 'more_horiz' ? 'left-start' : 'left'"
    :showArrow="item.icon !== 'more_horiz'"
    :manual="item.icon === 'more_horiz'"
    :offset="item.icon === 'more_horiz' ? [0, 8] : [0, 12]"
  )
    template(#trigger)
      qr-code-a4(v-if='item.id === "printCard"' class='w-7.5 h-7.5 hover:bg-brand hover:text-brand flex justify-center items-center rounded-full bg-opacity-10')
        template(#activator="{ generatePdf }")
          svg-icon(:iconName='item.icon' size='24' @click="generatePdf([material])")
      div(v-else class='w-7.5 h-7.5 hover:bg-brand hover:text-brand flex justify-center items-center rounded-full bg-opacity-10' @click="handleClick(item)")
        svg-icon(:iconName='item.icon' size='24')
    template(#content)
      div(v-if="item.icon !== 'more_horiz'" class="py-3 px-3 text-primary text-caption whitespace-nowrap") {{item.name}}
      div(v-else class='w-55 py-2.5')
        div(v-for="(block, index) in options" class='text-black-400')
          template(v-for="option in block")
            qr-code-general(v-if='option.id === "printQRCode"')
              template(#activator="{ generatePdf }")
                list-item(class='text-body2 text-primary px-7' @click="generatePdf([material])") {{option.name}}
            list-item(
              v-else
              class='text-body2 text-primary px-7'
              @click="handleClick(option)"
            ) {{option.name}}
          div(class="mx-2 my-1" :class='{"border-b": index !== options.length-1}')
</template>

<script>
import useAssets from '@/composables/useAssets'
import QrCodeA4 from '@/components/qrcode/QrCodeA4'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral'

export default {
  name: 'RowItemSidebar',
  components: { QrCodeA4, QrCodeGeneral },
  props: {
    material: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const {
      editMaterial,
      printCard,
      downloadU3M,
      carbonCopy,
      cloneTo,
      addToWorkspace,
      create3DMaterial,
      exportExcel,
      printQRCode,
      deleteMaterial
    } = useAssets(props.material)

    const iconList = [
      editMaterial,
      printCard,
      downloadU3M,
      { icon: 'more_horiz' }
    ]

    const options = [
      [
        carbonCopy,
        cloneTo,
        addToWorkspace
      ],
      [
        create3DMaterial,
        exportExcel,
        printQRCode
      ],
      [
        deleteMaterial
      ]
    ]

    const handleClick = (option) => {
      option.func && option.func()
    }

    return {
      iconList,
      options,
      handleClick
    }
  }
}
</script>
