import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'

import { downloadFile } from '@frontier/lib'
import { useNotifyStore } from '@/stores/notify'
import useNavigation from '@/composables/useNavigation'
import useCurrentUnit from '@/composables/useCurrentUnit'
import { U3M_STATUS, NOTIFY_TYPE } from '@/utils/constants'
import { useRoute } from 'vue-router'
import type { Material } from '@frontier/platform-web-sdk'
import type { FunctionOption } from '@/types'
import usePrint from '@/composables/material/usePrint'
import useCPrint from '@/composables/material/useCustomPrint'
import generalApi from '@/apis/general'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import type { PropsModalCloneTo } from '@/components/common/ModalCloneTo.vue'
import { useAssetsStore } from '@/stores/assets'
import type { PropsModalItemNoList } from '@/components/common/material/ModalItemNoList.vue'
import type { PropsModalHowToScan } from '@/components/assets/ModalHowToScan.vue'
import type { PropsModalWorkspaceNodeList } from '@/components/workspace/ModalWorkspaceNodeList.vue'
import type { PropsModalU3mDownload } from '@/components/common/material/u3m/ModalU3mDownload.vue'
import Modal3dQuotaExceeded from '@/components/assets/Modal3dQuotaExceeded.vue'

export enum ASSETS_MATERIAL_FUNCTION {
  EDIT = 0,
  CLONE = 1,
  ADD_TO_WORKSPACE = 2,
  CREATE_U3M = 3,
  DOWNLOAD_U3M = 4,
  EXPORT_EXCEL = 5,
  PRINT_LABEL = 6,
  PRINT_A4_SWATCH = 7,
  MERGE = 8,
  DELETE = 9,
  START_SPREAD_SHEET_UPDATE = 10,
}

export type AssetsFunctionOption = FunctionOption<
  Material,
  ASSETS_MATERIAL_FUNCTION
> & { testId?: string }

export interface QrCodePrintLabelSetting {
  fontSize: number
  wovenOptions: {
    isPrintMaterialType: boolean
    isPrintMaterialDescription: boolean
    isPrintDensity: boolean
    isPrintYarnSize: boolean
  }
  knitOptions: {
    isPrintMaterialType: boolean
    isPrintMaterialDescription: boolean
    isPrintMachineType: boolean
    isPrintYarnSize: boolean
    isPrintWales: boolean
    isPrintCourses: boolean
    isPrintMachineGauge: boolean
  }
  leatherOptions: {
    isPrintMaterialType: boolean
    isPrintMaterialDescription: boolean
    isPrintGrade: boolean
    isPrintTannage: boolean
    isPrintAverageSkinHideSize: boolean
    isPrintThickness: boolean
  }
  nonwovenOptions: {
    isPrintMaterialType: boolean
    isPrintMaterialDescription: boolean
    isPrintBondingMethod: boolean
    isPrintThickness: boolean
  }
  trimOptions: {
    isPrintMaterialType: boolean
    isPrintMaterialDescription: boolean
    isPrintTrimDiameter: boolean
    isPrintTrimLength: boolean
    isPrintTrimThickness: boolean
    isPrintTrimWidth: boolean
  }
  otherOptions: {
    isPrintMaterialType: boolean
    isPrintMaterialDescription: boolean
  }
  materialInfoOptions: {
    isPrintFeature: boolean
    isPrintContent: boolean
    isPrintWidth: boolean
    isPrintFinish: boolean
    isPrintColor: boolean
    isPrintPattern: boolean
    isPrintOrgName: boolean
    isPrintFrontierNo: boolean
  }
  ecoImpactorOptions: {
    isPrintGHG: boolean
    isPrintWaterDepletion: boolean
    isPrintLandUse: boolean
    isPrintCapturedTime: boolean
  }
}

export const DefaultPrintLabelSetting: QrCodePrintLabelSetting = {
  fontSize: 7,
  wovenOptions: {
    isPrintMaterialType: true,
    isPrintMaterialDescription: true,
    isPrintDensity: true,
    isPrintYarnSize: true,
  },
  knitOptions: {
    isPrintMaterialType: true,
    isPrintMaterialDescription: true,
    isPrintMachineType: true,
    isPrintYarnSize: true,
    isPrintWales: true,
    isPrintCourses: true,
    isPrintMachineGauge: true,
  },
  leatherOptions: {
    isPrintMaterialType: true,
    isPrintMaterialDescription: true,
    isPrintGrade: true,
    isPrintTannage: true,
    isPrintAverageSkinHideSize: true,
    isPrintThickness: true,
  },
  nonwovenOptions: {
    isPrintMaterialType: true,
    isPrintMaterialDescription: true,
    isPrintBondingMethod: true,
    isPrintThickness: true,
  },
  trimOptions: {
    isPrintMaterialType: true,
    isPrintMaterialDescription: true,
    isPrintTrimDiameter: true,
    isPrintTrimLength: true,
    isPrintTrimThickness: true,
    isPrintTrimWidth: true,
  },
  otherOptions: {
    isPrintMaterialType: true,
    isPrintMaterialDescription: true,
  },
  materialInfoOptions: {
    isPrintFrontierNo: false,
    isPrintOrgName: false,
    isPrintFeature: true,
    isPrintContent: true,
    isPrintWidth: true,
    isPrintFinish: true,
    isPrintColor: true,
    isPrintPattern: true,
  },
  ecoImpactorOptions: {
    isPrintGHG: true,
    isPrintWaterDepletion: true,
    isPrintLandUse: true,
    isPrintCapturedTime: true,
  },
}

export default function useAssets() {
  const print = usePrint()
  const customPrint = useCPrint()
  const route = useRoute()
  const plan = computed(() => store.getters['polling/plan'])

  const { ogNodeId } = useCurrentUnit()
  const toMaterial = (m: Material | Material[]) => (Array.isArray(m) ? m[0] : m)
  const toMaterialList = (m: Material | Material[]) =>
    Array.isArray(m) ? m : [m]
  const toMaterialIdList = (m: Material | Material[]) =>
    toMaterialList(m).map(({ materialId }) => materialId)
  const ogBaseGeneralApiWrapper = useOgBaseApiWrapper(generalApi)

  const { t } = useI18n()
  const store = useStore()
  const orgId = store.getters['organization/orgId']
  const {
    ogBaseAssetsApi,
    startSpreadsheetUpdate: startSpreadsheetUpdateAction,
  } = useAssetsStore()
  const notify = useNotifyStore()
  const {
    goToAssetMaterialEdit,
    goToMaterialUpload,
    goToProgress,
    goToWorkspace,
  } = useNavigation()

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
  const startSpreadSheetUpdate: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.START_SPREAD_SHEET_UPDATE,
    name: () => t('MI0143'),
    func: (n) => {
      startSpreadsheetUpdateAction(Array.isArray(n) ? n : [n])
    },
    icon: () => 'add',
    disabled: () => false,
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

      if (
        !plan.value.quota.u3m.isUnlimited &&
        plan.value.quota.u3m.used === plan.value.quota.u3m.max
      ) {
        store.dispatch('helper/openModalCommon', {
          body: Modal3dQuotaExceeded,
          classModal: 'w-128',
        })
        return
      }

      if (localStorage.getItem('haveReadU3mInstruction') === 'y') {
        store.dispatch('helper/openModalBehavior', {
          component: 'modal-u3m-preview',
          properties: { material },
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
                properties: { material },
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
    testId: 'create-3d-material',
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
      const materialU3mList = toMaterialList(m).map(
        ({ materialId, itemNo, u3m, customU3m }) => ({
          materialId,
          itemNo,
          u3m,
          customU3m,
        })
      )
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-u3m-download',
        properties: { materialU3mList } as PropsModalU3mDownload,
      })
    },
  }
  const exportExcel: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.EXPORT_EXCEL,
    name: () => t('RR0060'),
    func: async (m) => {
      const materialIdList = toMaterialIdList(m)
      store.dispatch('helper/openModalLoading')
      const {
        data: { result },
      } = await ogBaseAssetsApi('exportAssetsMaterialExcel', {
        materialIdList,
      })
      result?.excelUrl && downloadFile(result.excelUrl)

      store.dispatch('helper/closeModalLoading')
    },
  }
  const printLabel: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.PRINT_LABEL,
    name: () => t('RR0061'),
    func: async (m) => {
      store.dispatch('helper/openModalBehavior', {
        component: store.getters['permission/isJBRule']
          ? 'modal-label-preview-custom'
          : 'modal-label-preview',
        properties: {
          materialList: toMaterialList(m),
          printLabel: async (
            materialList: Material[],
            setting: QrCodePrintLabelSetting
          ): Promise<void> => {
            store.getters['permission/isJBRule']
              ? await customPrint.printLabel(materialList)
              : await print.printLabel(materialList, setting)
          },
          updateSetting: async (
            setting: QrCodePrintLabelSetting
          ): Promise<void> => {
            await store.dispatch('user/createPrintLabelSetting', setting)
          },
        },
      })
    },
  }
  const printA4Swatch: AssetsFunctionOption = {
    id: ASSETS_MATERIAL_FUNCTION.PRINT_A4_SWATCH,
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
    testId: 'delete-material',
    func: async (
      // & symbol is used as an intersection type operator to combine multiple types into one that includes all properties from the constituent types.
      m: (Material[] | Material) & { routerBackNodeId?: number }
    ) => {
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
            if (route.path.includes('/workspace/material')) {
              goToWorkspace({}, m?.routerBackNodeId || ogNodeId.value)
            } else {
              store.dispatch('helper/reloadInnerApp')
            }
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
    startSpreadSheetUpdate,
  }
}
