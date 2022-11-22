import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'
import { U3M_STATUS } from '@/utils/constants'
import { printA4Card, printGeneralLabel } from '@/utils/print'

export default function useAssets() {
  const { t } = useI18n()
  const store = useStore()
  const { goToAssetMaterialEdit, goToMaterialUpload, goToProgress } =
    useNavigation()

  const editMaterial = {
    id: 'editMaterial',
    icon: 'create',
    name: t('RR0054'),
    func: goToAssetMaterialEdit,
  }

  const cloneTo = {
    id: 'cloneTo',
    name: t('RR0167'),
    func: (v) => {
      const materialIdList = Array.isArray(v)
        ? v.map(({ materialId }) => materialId)
        : [v.materialId]

      store.dispatch('helper/openModalBehavior', {
        component: 'modal-clone-to',
        properties: {
          checkHandler: async () => {
            return store.dispatch('assets/cloneCheck', { materialIdList })
          },
          cloneHandler: async (targetLocationList, optional) => {
            await store.dispatch('assets/cloneMaterial', {
              targetLocationList,
              materialIdList,
              optional,
            })
            store.dispatch('helper/reloadInnerApp')
            store.dispatch('helper/pushFlashMessage', t('EE0056'))
          },
        },
      })
    },
  }

  const addToWorkspace = {
    id: 'addToWorkspace',
    name: t('RR0057'),
    func: (v) => {
      const materialList = Array.isArray(v) ? v : [v]
      if (materialList.length === 1 && !materialList[0].isComplete) {
        return store.dispatch('helper/openModalConfirm', {
          type: 1,
          header: t('EE0096'),
          contentText: t('EE0097'),
          primaryBtnText: t('UU0031'),
        })
      }

      store.dispatch('helper/openModalBehavior', {
        component: 'modal-workspace-node-list',
        properties: {
          modalTitle: t('EE0057'),
          actionText: t('UU0035'),
          actionCallback: async (nodeList) => {
            const materialIdList = materialList.map(
              (material) => material.materialId
            )
            const failMaterialList = await store.dispatch(
              'assets/addToWorkspace',
              {
                materialIdList,
                targetWorkspaceNodeList: nodeList.map(({ nodeKey }) => {
                  const [location, id] = nodeKey.split('-')
                  return { id, location }
                }),
              }
            )

            if (failMaterialList && failMaterialList.length > 0) {
              store.dispatch('helper/openModalBehavior', {
                component: 'modal-material-no-list',
                properties: {
                  header: t('EE0063', { number: failMaterialList.length }),
                  primaryBtnText: t('UU0031'),
                  primaryBtnHandler: () => {
                    store.dispatch('helper/closeModalBehavior')
                  },
                  content: t('EE0064'),
                  materialNoList: failMaterialList,
                },
              })
            } else {
              store.dispatch('helper/closeModal')
            }

            if (
              !failMaterialList ||
              failMaterialList.length !== materialIdList.length
            ) {
              store.dispatch('helper/pushFlashMessage', t('EE0062'))
            }
          },
        },
      })
    },
  }

  const create3DMaterial = {
    id: 'create3DMaterial',
    name: t('RR0058'),
    func: (v) => {
      const status = v.u3m.status
      store.dispatch('assets/setMaterial', v)

      if (!v.isComplete) {
        store.dispatch('helper/openModalConfirm', {
          type: 0,
          header: t('EE0142'),
          contentText: t('EE0143'),
          primaryBtnText: t('UU0126'),
          primaryBtnHandler: () => {
            goToAssetMaterialEdit(v)
            store.dispatch('helper/closeModalBehavior')
          },
          secondaryBtnText: t('UU0127'),
        })
        return
      }

      switch (status) {
        case U3M_STATUS.UNQUALIFIED:
          store.dispatch('helper/openModalConfirm', {
            type: 0,
            header: t('EE0124'),
            contentText: t('EE0125'),
            secondaryBtnText: t('UU0031'),
            textBtnText: t('UU0032'),
            closeAfterTextBtnHandler: false,
            textBtnHandler: () => {
              store.dispatch('helper/openModalBehavior', {
                component: 'modal-how-to-scan',
                properties: {
                  header: t('UU0032'),
                  title: t('EE0109'),
                  description: t('EE0110'),
                  primaryBtnText: t('UU0094'),
                  secondaryBtnText: t('UU0092'),
                  primaryHandler: () => {
                    store.dispatch('helper/closeModalBehavior')
                  },
                  secondaryHandler: () => {
                    goToMaterialUpload()
                    store.dispatch('helper/closeModalBehavior')
                  },
                  materialList: [v],
                },
              })
            },
          })
          break
        case U3M_STATUS.PROCESSING:
        case U3M_STATUS.IN_QUEUE:
          store.dispatch('helper/openModalConfirm', {
            type: 0,
            header: t('RR0162'),
            contentText: t('EE0072'),
            primaryBtnText: t('UU0031'),
          })
          break
        default:
          if (localStorage.getItem('haveReadU3mInstruction') === 'y') {
            store.dispatch('helper/openModalBehavior', {
              component: 'modal-u3m-preview',
            })
          } else {
            localStorage.setItem('haveReadU3mInstruction', 'y')
            store.dispatch('helper/openModalBehavior', {
              component: 'modal-u3m-instruction',
              properties: {
                primaryBtnText: t('UU0095'),
                primaryHandler: () => {
                  store.dispatch('helper/replaceModalBehavior', {
                    component: 'modal-u3m-preview',
                  })
                },
                secondaryBtnText: t('UU0026'),
                secondaryHandler: () => {
                  store.dispatch('helper/closeModalBehavior')
                },
              },
            })
          }
      }
    },
  }

  const downloadU3M = {
    id: 'downloadU3M',
    icon: 'u3m',
    name: t('RR0059'),
    func: (v) => {
      const materialList = Array.isArray(v) ? v : [v]
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-u3m-select-file-format',
        properties: { materialList },
      })
    },
  }

  const exportExcel = {
    id: 'exportExcel',
    name: t('RR0060'),
    func: async (v) => {
      const materialIdList = Array.isArray(v)
        ? v.map(({ materialId }) => materialId)
        : [v.materialId]

      if (materialIdList.length >= 100) {
        await store.dispatch('assets/massExportMaterial', { materialIdList })
        store.dispatch('helper/openModalConfirm', {
          type: 2,
          header: t('PP0030'),
          contentText: t('PP0031'),
          primaryBtnText: t('UU0031'),
          secondaryBtnText: t('UU0090'),
          secondaryBtnHandler: () => {
            goToProgress('excel')
            store.dispatch('helper/closeModalBehavior')
          },
        })
      } else {
        store.dispatch('helper/openModalLoading')
        await store.dispatch('assets/exportMaterial', { materialIdList })
        store.dispatch('helper/closeModalLoading')
      }
    },
  }

  const printQRCode = {
    id: 'printQRCode',
    name: t('RR0061'),
    func: (v) => {
      const materialList = Array.isArray(v) ? v : [v]
      printGeneralLabel(materialList)
    },
  }

  const printCard = {
    id: 'printCard',
    icon: 'print',
    name: t('RR0062'),
    func: (v) => {
      const materialList = Array.isArray(v) ? v : [v]
      printA4Card(materialList)
    },
  }

  const mergeCard = {
    id: 'mergeCard',
    name: t('RR0072'),
    func: (materialList) => {
      store.dispatch('helper/openModal', {
        component: 'modal-material-merge',
        properties: { materialList },
      })
    },
  }

  const deleteMaterial = {
    id: 'deleteMaterial',
    name: t('RR0063'),
    func: async (v) => {
      const materialIdList = Array.isArray(v)
        ? v.map(({ materialId }) => materialId)
        : [v.materialId]

      const { isOnExportingExcel, isOnGeneratingU3m, materialNoList } =
        await store.dispatch('assets/deleteCheckMaterial', { materialIdList })
      if (!isOnExportingExcel && !isOnGeneratingU3m) {
        store.dispatch('helper/openModalConfirm', {
          type: 1,
          header: t('EE0075'),
          contentText: t('EE0076'),
          primaryBtnText: t('UU0001'),
          primaryBtnHandler: async () => {
            store.dispatch('helper/openModalLoading')
            await store.dispatch('assets/deleteMaterial', { materialIdList })
            store.dispatch('helper/closeModalLoading')
            store.dispatch('helper/reloadInnerApp')
          },
          secondaryBtnText: t('UU0002'),
        })
      } else if (isOnGeneratingU3m) {
        store.dispatch('helper/openModalConfirm', {
          type: 1,
          header: t('EE0111'),
          contentText: t('EE0112'),
          secondaryBtnText: t('UU0094'),
        })
      } else if (isOnExportingExcel) {
        if (materialIdList.length > 1) {
          store.dispatch('helper/openModalConfirm', {
            type: 1,
            header: t('EE0111'),
            contentText: t('EE0112'),
            primaryBtnText: t('UU0091'),
            secondaryBtnText: t('UU0098'),
            closeAfterSecondaryBtnHandler: false,
            textBtnText: t('UU0002'),
            primaryBtnHandler: async () => {
              store.dispatch('helper/openModalLoading')
              await store.dispatch('assets/deleteMaterial', { materialIdList })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
            },
            secondaryBtnHandler: () => {
              store.dispatch('helper/pushModalBehavior', {
                component: 'modal-material-no-list',
                properties: {
                  header: t('EE0116'),
                  secondaryBtnText: t('UU0026'),
                  secondaryBtnHandler: () => {
                    store.dispatch('helper/closeModalBehavior')
                  },
                  materialNoList,
                },
              })
            },
          })
        } else {
          store.dispatch('helper/openModalConfirm', {
            type: 1,
            header: t('EE0113'),
            contentText: t('EE0114', { materialNo: materialIdList[0] }),
            primaryBtnText: t('UU0091'),
            secondaryBtnText: t('UU0002'),
            primaryBtnHandler: async () => {
              store.dispatch('helper/openModalLoading')
              await store.dispatch('assets/deleteMaterial', { materialIdList })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
            },
          })
        }
      }
    },
  }

  return {
    editMaterial,
    cloneTo,
    addToWorkspace,
    create3DMaterial,
    downloadU3M,
    exportExcel,
    printQRCode,
    printCard,
    mergeCard,
    deleteMaterial,
  }
}
