import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { TARGET_LOCATION, U3M_STATUS } from '@/utils/constants'

export default function useAssets () {
  const { t } = useI18n()
  const { goToAssetMaterialEdit, goToAssetsMaterialMerge } = useNavigation()
  const store = useStore()

  const routeLocation = computed(() => store.getters['helper/routeLocation'])

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
      store.dispatch('helper/reloadInnerApp')
      store.commit('helper/PUSH_message', t('EE0084'))
    }
  }

  const cloneTo = {
    id: 'cloneTo',
    name: t('RR0056'),
    func: (v) => {
      const materialIdList = Array.isArray(v) ? v.map(material => JSON.parse(material).materialId) : [v.materialId]
      const organization = store.getters['organization/organization']
      const currentGroupId = store.getters['group/groupId'] || null
      const locationList = []
      const groupList = routeLocation.value === 'org'
        ? organization.groupList
        : organization.groupList.filter(group => group.groupId !== currentGroupId)

      if (routeLocation.value === 'group') {
        locationList.push({
          id: organization.orgId,
          name: organization.orgName,
          location: TARGET_LOCATION.ORG
        })
      }

      groupList.forEach(group => {
        locationList.push({
          id: group.groupId,
          name: group.groupName,
          location: TARGET_LOCATION.GROUP
        })
      })

      store.dispatch('helper/openModal', {
        component: 'modal-clone-to',
        properties: {
          locationList,
          cloneHandler: async (targetLocationList) => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('assets/cloneMaterial', { targetLocationList, materialIdList })
            store.dispatch('helper/closeModalLoading')
            store.commit('helper/PUSH_message', t('EE0056'))
          }
        }
      })
    }
  }

  const addToWorkspace = {
    id: 'addToWorkspace',
    name: t('RR0057'),
    func: (v) => {
      const materialList = Array.isArray(v) ? v.map(material => JSON.parse(material)) : [v]
      if (materialList.length === 1 && !materialList[0].isComplete) {
        return store.dispatch('helper/openModalConfirm', {
          title: t('EE0096'),
          content: t('EE0097'),
          primaryText: t('UU0031')
        })
      }

      store.dispatch('helper/openModal', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('EE0057'),
          canCrossLocation: routeLocation.value === 'org',
          actionText: t('UU0035'),
          actionCallback: async (selectedNodeKeyList) => {
            const materialIdList = materialList.map(material => material.materialId)
            const failMaterialList = await store.dispatch('assets/addToWorkspace', {
              materialIdList,
              targetWorkspaceNodeList: selectedNodeKeyList.map(nodeKey => {
                const [location, id] = nodeKey.split('-')
                return { id, location }
              })
            })

            if (failMaterialList && failMaterialList.length > 0) {
              store.dispatch('helper/openModal', {
                component: 'modal-add-to-workspace-fail',
                properties: {
                  failMaterialList
                }
              })
            } else {
              store.dispatch('helper/closeModal')
            }

            if (!failMaterialList || (failMaterialList.length !== materialIdList.length)) {
              store.commit('helper/PUSH_message', t('EE0062'))
            }
          }
        }
      })
    }
  }

  const create3DMaterial = {
    id: 'create3DMaterial',
    name: t('RR0058'),
    excName: t('RR0074'),
    func: (v) => {
      const status = v.u3m.status
      store.commit('material/UPDATE_material', v)
      switch (status) {
        case U3M_STATUS.INITIAL:
          if (localStorage.getItem('haveReadU3mInstruction') === 'y') {
            store.dispatch('helper/openModal', {
              component: 'modal-u3m-preview',
              header: t('EE0067')
            })
          } else {
            localStorage.setItem('haveReadU3mInstruction', 'y')
            store.dispatch('helper/openModal', {
              component: 'modal-u3m-instruction'
            })
          }
          break
        case U3M_STATUS.UNQUALIFIED:
          store.dispatch('helper/openModal', {
            component: 'modal-u3m-instruction'
          })
          break
        case U3M_STATUS.PROCESSING:
          store.dispatch('helper/openModalConfirm', {
            title: t('EE0071'),
            content: t('EE0072'),
            primaryText: t('UU0031')
          })
          break
        case U3M_STATUS.FAIL:
          store.dispatch('helper/openModal', {
            component: 'modal-u3m-create-fail'
          })
          break
        default:
          store.dispatch('helper/openModal', {
            component: 'modal-u3m-preview',
            header: t('EE0067')
          })
      }
    }
  }

  const downloadU3M = {
    id: 'downloadU3M',
    icon: 'u3m',
    name: t('RR0059'),
    func: (v) => {
      store.dispatch('helper/openModal', {
        component: 'modal-u3m-select-file-format',
        properties: {
          material: v
        }
      })
    }
  }

  const exportExcel = {
    id: 'exportExcel',
    name: t('RR0060'),
    func: async (v) => {
      const materialIdList = Array.isArray(v) ? v.map(material => JSON.parse(material).materialId) : [v.materialId]
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
    func: (v) => {
      const materialList = v.map(material => JSON.parse(material))
      store.commit('assets/SET_preMergeList', materialList)
      store.commit('assets/RESET_mergedList')
      goToAssetsMaterialMerge()
    }
  }

  const deleteMaterial = {
    id: 'deleteMaterial',
    name: t('RR0063'),
    func: (v) => {
      const materialIdList = Array.isArray(v) ? v.map(material => JSON.parse(material).materialId) : [v.materialId]
      store.dispatch('helper/openModalConfirm', {
        title: t('EE0075'),
        content: t('EE0076'),
        secondaryText: t('UU0001'),
        secondaryHandler: async () => {
          store.dispatch('helper/openModalLoading')
          await store.dispatch('assets/deleteMaterial', { materialIdList })
          store.dispatch('helper/closeModalLoading')
          store.dispatch('helper/reloadInnerApp')
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
