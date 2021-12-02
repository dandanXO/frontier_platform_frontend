import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'
import { inject } from 'vue'

export default function useAssets () {
  const { t } = useI18n()
  const { goToAssetMaterialEdit, goToAssetsMaterialMerge } = useNavigation()
  const store = useStore()
  const reloadRootRoute = inject('reloadRootRoute')

  const editMaterial = {
    id: 'editMaterial',
    icon: 'create',
    name: t('RR0054'),
    func: goToAssetMaterialEdit
  }

  const carbonCopy = {
    id: 'carbonCopy',
    name: t('RR0055'),
    func: async (v) => {
      store.dispatch('helper/openModalLoading')
      await store.dispatch('assets/carbonCopyMaterial', { materialId: v.materialId })
      store.dispatch('helper/closeModalLoading')
      reloadRootRoute()
    }
  }

  const cloneTo = {
    id: 'cloneTo',
    name: t('RR0056'),
    func: (v) => {
      const materialIdList = Array.isArray(v) ? v.map(item => item.materialId) : [v.materialId]
      store.dispatch('helper/openModal', {
        component: 'modal-clone-to',
        properties: {
          materialIdList: materialIdList
        }
      })
    }
  }

  const addToWorkspace = {
    id: 'addToWorkspace',
    name: t('RR0057'),
    func: (v) => {
      const materialList = Array.isArray(v) ? v : [v]
      store.dispatch('helper/openModal', {
        component: 'modal-add-to-workspace',
        properties: {
          materialList: materialList
        }
      })
    }
  }

  const create3DMaterial = {
    id: 'create3DMaterial',
    name: t('RR0058'),
    func: () => { console.log('create3DMaterial') }
  }

  const downloadU3M = {
    id: 'downloadU3M',
    icon: 'u3m',
    name: t('RR0059'),
    func: () => { console.log('downloadU3M') }
  }

  const exportExcel = {
    id: 'exportExcel',
    name: t('RR0060'),
    func: async (v) => {
      const materialIdList = Array.isArray(v) ? v.map(item => item.materialId) : [v.materialId]
      store.dispatch('helper/openModalLoading')
      await store.dispatch('assets/exportMaterial', { materialIdList })
      store.dispatch('helper/closeModalLoading')
    }
  }

  const printQRCode = {
    id: 'printQRCode',
    name: t('RR0061')
  }

  const printCard = {
    id: 'printCard',
    icon: 'print',
    name: t('RR0062')
  }

  const mergeCard = {
    id: 'mergeCard',
    name: t('RR0072'),
    func: (materialList) => {
      store.commit('assets/SET_preMergeList', materialList)
      store.commit('assets/RESET_mergedList')
      goToAssetsMaterialMerge()
    }
  }

  const deleteMaterial = {
    id: 'deleteMaterial',
    name: t('RR0063'),
    func: (v) => {
      const materialIdList = Array.isArray(v) ? v.map(item => item.materialId) : [v.materialId]
      store.dispatch('helper/openModalConfirm', {
        title: t('EE0075'),
        content: t('EE0076'),
        secondaryText: t('UU0001'),
        secondaryHandler: async () => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('assets/deleteMaterial', { materialIdList })
          if (Array.isArray(v)) {
            store.commit('assets/CLEAR_addedMaterialList')
          }
          store.dispatch('helper/closeModalLoading')
          reloadRootRoute()
        }
      })
    }
  }

  return {
    editMaterial,
    carbonCopy,
    cloneTo,
    addToWorkspace,
    create3DMaterial,
    downloadU3M,
    exportExcel,
    printQRCode,
    printCard,
    mergeCard,
    deleteMaterial
  }
}
