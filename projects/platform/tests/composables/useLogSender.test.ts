import { useRoute } from 'vue-router'
import { FeatureType } from '@frontier/platform-web-sdk'
import dashboardApi from '@/apis/dashboard'
import useLogSender from '@/composables/useLogSender'
import { U3M_FILE_TYPE } from '@/utils/constants'
import type { Mock } from 'vitest'

vi.mock('vue-router')
vi.mock('@/apis/dashboard', async () => {
  const baseFn = () => {
    return new Promise((resolve) => {
      resolve({
        success: true,
        data: true,
      })
    })
  }
  const createViewerLog = vi.fn(baseFn)
  const createDownloadLog = vi.fn(baseFn)
  const createReceivePageLog = vi.fn(baseFn)
  const createEmbedPageLog = vi.fn(baseFn)

  return {
    default: {
      createViewerLog,
      createDownloadLog,
      createReceivePageLog,
      createEmbedPageLog,
    },
  }
})

describe('useLogSender', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createViewerLog', () => {
    const materialId = 66
    const testCases = [
      {
        it: 'should record Public Library page view log',
        args: {
          materialId,
          path: 'public-library',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.PUBLIC_LIBRARY,
        },
      },
      {
        it: 'should record Showroom page view log',
        args: {
          materialId,
          path: 'showroom',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.PUBLIC_LIBRARY,
        },
      },
      {
        it: 'should record Assets page view log',
        args: {
          materialId,
          path: 'assets',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.ASSETS,
        },
      },
      {
        it: 'should record Progress page view log',
        args: {
          materialId,
          path: 'progress',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.ASSETS,
        },
      },
      {
        it: 'should record Workspace page view log',
        args: {
          materialId,
          path: 'workspace',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.WORKSPACE,
        },
      },
      {
        it: 'should record Shared With Me page view log',
        args: {
          materialId,
          path: 'share-to-me',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.SHARED_WITH_ME,
        },
      },
      {
        it: 'should record Received Shared page view log',
        args: {
          materialId,
          path: 'received-share',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.RECEIVED_SHARE,
        },
      },
      {
        it: 'should record Embed page view log',
        args: {
          materialId,
          path: 'embed',
        },
        expected: {
          materialId,
          fromLocationType: FeatureType.EMBED,
        },
      },
    ]

    const testCaseRunner = (
      testName: string,
      args: {
        path: string
        materialId: number
      },
      expected: {
        materialId: number
        fromLocationType: FeatureType
      }
    ) => {
      it(testName, async () => {
        ;(useRoute as Mock).mockReturnValue({ path: args.path })
        const logSender = useLogSender()
        await logSender.createViewerLog(args.materialId)

        expect(dashboardApi.createViewerLog).toHaveBeenCalledTimes(1)
        expect(dashboardApi.createViewerLog).toHaveBeenCalledWith({
          materialId: expected.materialId,
          fromLocationType: expected.fromLocationType,
        })
      })
    }

    testCases.forEach((testCase) => {
      testCaseRunner(testCase.it, testCase.args, testCase.expected)
    })
  })

  describe('createDownloadLog', () => {
    const testCaseRunner = (
      testName: string,
      args: {
        path: string
        materialId: number
        selectedFormat: string
      },
      expected: {
        materialId: number
        category: U3M_FILE_TYPE
        fromLocationType: FeatureType
      }
    ) => {
      it(testName, async () => {
        ;(useRoute as Mock).mockReturnValue({ path: args.path })
        const logSender = useLogSender()
        await logSender.createDownloadLog(args.materialId, args.selectedFormat)

        expect(dashboardApi.createDownloadLog).toHaveBeenCalledTimes(1)
        expect(dashboardApi.createDownloadLog).toHaveBeenCalledWith({
          materialId: expected.materialId,
          category: expected.category,
          fromLocationType: expected.fromLocationType,
        })
      })
    }

    describe('by file type', () => {
      const materialId = 66
      const testCases = [
        {
          it: 'should record user download u3m file',
          args: {
            materialId,
            path: 'public-library',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.PUBLIC_LIBRARY,
          },
        },
        {
          it: 'should record user download u3ma file',
          args: {
            materialId,
            path: 'public-library',
            selectedFormat: 'u3maUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3MA,
            fromLocationType: FeatureType.PUBLIC_LIBRARY,
          },
        },
        {
          it: 'should record user download gltf file',
          args: {
            materialId,
            path: 'public-library',
            selectedFormat: 'gltfUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.GLTF,
            fromLocationType: FeatureType.PUBLIC_LIBRARY,
          },
        },
      ]

      testCases.forEach((testCase) => {
        testCaseRunner(testCase.it, testCase.args, testCase.expected)
      })
    })

    describe('by route type', () => {
      const materialId = 66
      const testCases = [
        {
          it: 'should record Public Library page download log',
          args: {
            materialId,
            path: 'public-library',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.PUBLIC_LIBRARY,
          },
        },
        {
          it: 'should record Showroom page download log',
          args: {
            materialId,
            path: 'showroom',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.PUBLIC_LIBRARY,
          },
        },
        {
          it: 'should record Assets page download log',
          args: {
            materialId,
            path: 'assets',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.ASSETS,
          },
        },
        {
          it: 'should record Progress page download log',
          args: {
            materialId,
            path: 'progress',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.ASSETS,
          },
        },
        {
          it: 'should record Workspace page download log',
          args: {
            materialId,
            path: 'workspace',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.WORKSPACE,
          },
        },
        {
          it: 'should record Shared With Me page download log',
          args: {
            materialId,
            path: 'share-to-me',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.SHARED_WITH_ME,
          },
        },
        {
          it: 'should record Received Shared page download log',
          args: {
            materialId,
            path: 'received-share',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.RECEIVED_SHARE,
          },
        },
        {
          it: 'should record Embed page download log',
          args: {
            materialId,
            path: 'embed',
            selectedFormat: 'zipUrl',
          },
          expected: {
            materialId,
            category: U3M_FILE_TYPE.U3M,
            fromLocationType: FeatureType.EMBED,
          },
        },
      ]

      testCases.forEach((testCase) => {
        testCaseRunner(testCase.it, testCase.args, testCase.expected)
      })
    })
  })

  describe('createEmbedPageLog', () => {
    it('should record user view embed page', async () => {
      const sharingKey = 'ab1234'
      const expectedRequest = { sharingKey }

      const logSender = useLogSender()
      await logSender.createEmbedPageLog(sharingKey)

      expect(dashboardApi.createEmbedPageLog).toHaveBeenCalledTimes(1)
      expect(dashboardApi.createEmbedPageLog).toHaveBeenCalledWith(
        expectedRequest
      )
    })
  })

  describe('createReceivedPageLog', () => {
    it('should record user view received share page', async () => {
      const sharingKey = 'ab1234'
      const expectedRequest = { sharingKey }

      const logSender = useLogSender()
      await logSender.createReceivePageLog(sharingKey)

      expect(dashboardApi.createReceivePageLog).toHaveBeenCalledTimes(1)
      expect(dashboardApi.createReceivePageLog).toHaveBeenCalledWith(
        expectedRequest
      )
    })
  })
})
