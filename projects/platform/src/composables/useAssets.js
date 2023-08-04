import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import useNavigation from '@/composables/useNavigation'
import { U3M_STATUS, NOTIFY_TYPE } from '@/utils/constants'
import { printA4Card, printGeneralLabel } from '@/utils/print'

const toMaterialList = (material) =>
  Array.isArray(material) ? material : [material]
const toMaterialIdList = (material) =>
  toMaterialList(material).map((m) => m.materialId)

export default function useAssets() {
  const { t } = useI18n()
  const store = useStore()
  const notify = useNotifyStore()
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
    func: (material) => {
      const materialIdList = toMaterialIdList(material)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-clone-to',
        properties: {
          checkHandler: () =>
            store.dispatch('assets/cloneCheck', { materialIdList }),
          cloneHandler: async (targetLocationList, optional) => {
            await store.dispatch('assets/cloneMaterial', {
              targetLocationList,
              materialIdList,
              optional,
            })
            store.dispatch('helper/reloadInnerApp')
            notify.showNotifySnackbar({ messageText: t('EE0056') })
          },
        },
      })
    },
  }

  const addToWorkspace = {
    id: 'addToWorkspace',
    name: t('RR0057'),
    func: (material) => {
      const materialList = toMaterialList(material)
      const materialIdList = toMaterialIdList(material)
      if (materialList.length === 1 && !materialList[0].isComplete) {
        return store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
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
              notify.showNotifySnackbar({ messageText: t('EE0062') })
            }
          },
        },
      })
    },
  }

  const create3DMaterial = {
    id: 'create3DMaterial',
    name: (material) =>
      material.u3m.status === U3M_STATUS.COMPLETED ? t('RR0074') : t('RR0058'),
    func: (material) => {
      store.dispatch('assets/setMaterial', material)

      const { faceSideImg, backSideImg } = material
      const hasScannedImage = !!faceSideImg.original || !!backSideImg.original

      // isComplete 的規則是，所以必填欄位 + 有封面圖或上傳正或反面圖

      // 檢查是否缺少必填欄位。
      if (!material.isComplete && hasScannedImage) {
        return store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.INFO,
          header: t('EE0142'),
          contentText: t('EE0143'),
          primaryBtnText: t('UU0126'),
          primaryBtnHandler: () => {
            goToAssetMaterialEdit(material)
            store.dispatch('helper/closeModalBehavior')
          },
          secondaryBtnText: t('UU0127'),
        })
      }

      // 檢查是否缺少正面或反面圖。
      if (!hasScannedImage) {
        return store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.INFO,
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
                materialList: toMaterialList(material),
              },
            })
          },
        })
      }

      // 檢查是否已進入生產階段，包含處理中或是等待中。
      if (
        [U3M_STATUS.PROCESSING, U3M_STATUS.IN_QUEUE].includes(
          material.u3m.status
        )
      ) {
        return store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.INFO,
          header: t('RR0162'),
          contentText: t('EE0072'),
          primaryBtnText: t('UU0031'),
        })
      }

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
    },
  }

  const downloadU3M = {
    id: 'downloadU3M',
    icon: '3D_material',
    name: t('RR0059'),
    func: (material) => {
      const materialList = toMaterialList(material)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-u3m-download',
        properties: { materialList },
      })
    },
  }

  const exportExcel = {
    id: 'exportExcel',
    name: t('RR0060'),
    func: async (material) => {
      const materialIdList = toMaterialIdList(material)
      if (materialIdList.length >= 100) {
        await store.dispatch('assets/massExportMaterial', { materialIdList })
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.SUCCESS,
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
    func: (material) => {
      const materialList = toMaterialList(material)
      printGeneralLabel(materialList)
    },
  }

  const printCard = {
    id: 'printCard',
    icon: 'print',
    name: t('RR0062'),
    func: (material) => {
      const materialList = toMaterialList(material)
      printA4Card(materialList)
    },
  }

  const mergeCard = {
    id: 'mergeCard',
    name: t('RR0072'),
    disabled: (materialList) => materialList.length < 2,
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
    func: async (material) => {
      const materialIdList = toMaterialIdList(material)
      const { isOnExportingExcel, isOnGeneratingU3m, materialNoList } =
        await store.dispatch('assets/deleteCheckMaterial', { materialIdList })
      if (!isOnExportingExcel && !isOnGeneratingU3m) {
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
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
          type: NOTIFY_TYPE.WARNING,
          header: t('EE0111'),
          contentText: t('EE0112'),
          secondaryBtnText: t('UU0094'),
        })
      } else if (isOnExportingExcel) {
        if (materialIdList.length > 1) {
          store.dispatch('helper/openModalConfirm', {
            type: NOTIFY_TYPE.WARNING,
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
            type: NOTIFY_TYPE.WARNING,
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
