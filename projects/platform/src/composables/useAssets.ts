import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import useNavigation from '@/composables/useNavigation'
import { U3M_STATUS, NOTIFY_TYPE } from '@/utils/constants'
import type { Material } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import usePrint from '@/composables/material/usePrint'
import generalApi from '@/apis/general'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type { PropsModalCloneTo } from '@/components/common/ModalCloneTo.vue'
import { useAssetsStore } from '@/stores/assets'
import type { PropsModalItemNoList } from '@/components/common/material/ModalItemNoList.vue'
import type { PropsModalHowToScan } from '@/components/assets/ModalHowToScan.vue'
import type { PropsModalWorkspaceNodeList } from '@/components/workspace/ModalWorkspaceNodeList.vue'

export enum ASSETS_MATERIAL_FUNCTION {
  EDIT = 0,
  CLONE = 1,
  ADD_TO_WORKSPACE = 2,
  CREATE_U3M = 3,
  DOWNLOAD_U3M = 4,
  EXPORT_EXCEL = 5,
  PRINT_QR_CODE = 6,
  PRINT_A4_CARD = 7,
  MERGE = 8,
  DELETE = 9,
}

export type AssetsFunctionOption = FunctionOption<
  Material,
  ASSETS_MATERIAL_FUNCTION
>

export default function useAssets() {
  const print = usePrint()
  const toMaterial = (m: Material | Material[]) => (Array.isArray(m) ? m[0] : m)
  const toMaterialList = (m: Material | Material[]) =>
    Array.isArray(m) ? m : [m]
  const toMaterialIdList = (m: Material | Material[]) =>
    toMaterialList(m).map(({ materialId }) => materialId)
  const ogBaseGeneralApiWrapper = useOgBaseApiWrapper(generalApi)

  const { t } = useI18n()
  const store = useStore()
  const { ogBaseAssetsApi } = useAssetsStore()
  const notify = useNotifyStore()
  const { goToAssetMaterialEdit, goToMaterialUpload, goToProgress } =
    useNavigation()

  const editMaterial: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.EDIT,
    icon: () => 'create',
    name: () => t('RR0054'),
    func: (m) => {
      const material = toMaterial(m)
      goToAssetMaterialEdit(
        material.materialId,
        material.metaData.materialOwnerOGType!
      )
    },
  }
  const cloneTo: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.CLONE,
    name: () => t('RR0167'),
    func: (m) => {
      const materialIdList = toMaterialIdList(m)
      const properties: PropsModalCloneTo = {
        checkHandler: async () => {
          const { data } = await ogBaseGeneralApiWrapper(
            'cloneCheckByMaterial',
            {
              materialIdList,
            }
          )
          return data.result.estimatedQuota
        },
        cloneHandler: async (targetOgList, optional) => {
          await ogBaseAssetsApi('cloneAssetsMaterialList', {
            targetOgList,
            materialIdList,
            optional,
          })
          store.dispatch('helper/reloadInnerApp')
          notify.showNotifySnackbar({ messageText: t('EE0056') })
        },
      }

      store.dispatch('helper/openModalBehavior', {
        component: 'modal-clone-to',
        properties,
      })
    },
  }
  const addToWorkspace: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.ADD_TO_WORKSPACE,
    name: () => t('RR0057'),
    func: (m) => {
      const materialList = toMaterialList(m)
      const materialIdList = toMaterialIdList(m)
      if (materialList.length === 1 && !materialList[0].metaData.isComplete) {
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
          actionCallback: async (targetNodeIdList) => {
            const {
              data: {
                result: { failMaterialItemNoList },
              },
            } = await ogBaseAssetsApi('assetsMaterialAddToWorkspace', {
              materialIdList,
              targetNodeIdList,
            })
            if (failMaterialItemNoList && failMaterialItemNoList.length > 0) {
              store.dispatch('helper/openModalBehavior', {
                component: 'modal-item-no-list',
                properties: {
                  header: t('EE0063', {
                    number: failMaterialItemNoList.length,
                  }),
                  primaryBtnText: t('UU0031'),
                  primaryBtnHandler: () => {
                    store.dispatch('helper/closeModalBehavior')
                  },
                  content: t('EE0064'),
                  itemNoList: failMaterialItemNoList,
                } as PropsModalItemNoList,
              })
            } else {
              store.dispatch('helper/closeModal')
            }

            if (
              !failMaterialItemNoList ||
              failMaterialItemNoList.length !== materialIdList.length
            ) {
              notify.showNotifySnackbar({ messageText: t('EE0062') })
            }
          },
        } as PropsModalWorkspaceNodeList,
      })
    },
  }
  const createU3m: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.CREATE_U3M,
    name: (m) => {
      if (!m) {
        return t('RR0058')
      }

      const material = toMaterial(m)
      return material.u3m.status === U3M_STATUS.COMPLETED
        ? t('RR0074')
        : t('RR0058')
    },
    func: (m) => {
      const material = toMaterial(m)
      const { faceSide, backSide } = material
      const hasScannedImage = !!faceSide?.sideImage || !!backSide?.sideImage

      // 檢查是否缺少必填欄位。
      if (!material.metaData.isComplete && hasScannedImage) {
        return store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.INFO,
          header: t('EE0142'),
          contentText: t('EE0143'),
          primaryBtnText: t('UU0126'),
          primaryBtnHandler: () => {
            goToAssetMaterialEdit(
              material.materialId,
              material.metaData.materialOwnerOGType!
            )
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
              } as PropsModalHowToScan,
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
  const downloadU3m: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.DOWNLOAD_U3M,
    icon: () => '3D_material',
    name: () => t('RR0059'),
    disabled: (m) =>
      toMaterialList(m).every(
        (material) =>
          material.u3m.status !== U3M_STATUS.COMPLETED &&
          material.customU3m.status !== U3M_STATUS.COMPLETED
      ),
    func: (m) => {
      const materialList = toMaterialList(m)
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-u3m-download',
        properties: { materialList },
      })
    },
  }
  const exportExcel: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.EXPORT_EXCEL,
    name: () => t('RR0060'),
    func: async (m) => {
      const materialIdList = toMaterialIdList(m)
      if (materialIdList.length >= 100) {
        await ogBaseAssetsApi('massExportAssetsMaterialExcel', {
          materialIdList,
        })
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
        await ogBaseAssetsApi('exportAssetsMaterialExcel', { materialIdList })
        store.dispatch('helper/closeModalLoading')
      }
    },
  }
  const printLabel: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.PRINT_QR_CODE,
    name: () => t('RR0061'),
    func: (m) => {
      print.printLabel(toMaterialList(m))
    },
  }
  const printA4Swatch: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.PRINT_A4_CARD,
    icon: () => 'print',
    name: () => t('RR0062'),
    func: (m) => {
      print.printA4Swatch(toMaterialList(m))
    },
  }
  const mergeMaterial: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.MERGE,
    name: () => t('RR0072'),
    disabled: (m) => toMaterialList(m).length < 2,
    func: (m) => {
      store.dispatch('helper/openModal', {
        component: 'modal-material-merge',
        properties: { materialList: toMaterialList(m) },
      })
    },
  }
  const deleteMaterial: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.DELETE,
    name: () => t('RR0063'),
    func: async (m) => {
      const materialIdList = toMaterialIdList(m)
      const {
        data: {
          result: { isOnExportingExcel, isOnGeneratingU3m, itemNoList },
        },
      } = await ogBaseAssetsApi('checkDeleteAssetsMaterialList', {
        materialIdList,
      })
      if (!isOnExportingExcel && !isOnGeneratingU3m) {
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
          header: t('EE0075'),
          contentText: t('EE0076'),
          primaryBtnText: t('UU0001'),
          primaryBtnHandler: async () => {
            store.dispatch('helper/openModalLoading')
            await ogBaseAssetsApi('deleteAssetsMaterialList', {
              materialIdList,
            })
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
              await ogBaseAssetsApi('deleteAssetsMaterialList', {
                materialIdList,
              })
              store.dispatch('helper/closeModalLoading')
              store.dispatch('helper/reloadInnerApp')
            },
            secondaryBtnHandler: () => {
              store.dispatch('helper/pushModalBehavior', {
                component: 'modal-item-no-list',
                properties: {
                  header: t('EE0116'),
                  secondaryBtnText: t('UU0026'),
                  secondaryBtnHandler: () => {
                    store.dispatch('helper/closeModalBehavior')
                  },
                  itemNoList,
                } as PropsModalItemNoList,
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
              await ogBaseAssetsApi('deleteAssetsMaterialList', {
                materialIdList,
              })
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
    downloadU3m,
    cloneTo,
    addToWorkspace,
    createU3m,
    exportExcel,
    printLabel,
    printA4Swatch,
    deleteMaterial,
    mergeMaterial,
  }
}
