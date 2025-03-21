import generalApi from '@/apis/general'

export const putBinaryData = (
  url = '',
  data: Blob,
  onProgress: (progress: number, loaded: number, total: number) => void,
  signal: AbortSignal // 新增參數，用於取消請求
) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Cache-Control', 'no-cache')

    // 綁定取消信號
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload aborted'))
      })
    }

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        onProgress(progress, event.loaded, event.total)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Failed to upload: ${xhr.statusText}`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error'))

    xhr.send(data)
  })
}

export const uploadFileToS3 = async (
  file: File,
  fileName: string,
  onProgress: (progress: number, loaded: number, total: number) => void,
  signal: AbortSignal // 新增參數，用於取消請求
) => {
  const getUploadU3mResult = await generalApi.getS3UploadUrl({ fileName })
  const { s3UploadId, fileUploadUrl } = getUploadU3mResult.data.result
  await putBinaryData(fileUploadUrl, file, onProgress, signal)
  return { file, fileName, s3UploadId, fileUploadUrl }
}
