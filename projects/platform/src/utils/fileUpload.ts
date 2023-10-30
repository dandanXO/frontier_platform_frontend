import generalApi from '@/apis/general'

export const putBinaryData = (url = '', data: Blob) => {
  return fetch(url, {
    method: 'PUT',
    cache: 'no-cache',
    body: data,
  })
}

export const uploadFileToS3 = async (file: File, fileName: string) => {
  const getUploadU3mResult = await generalApi.getS3UploadUrl({ fileName })
  const { s3UploadId, fileUploadUrl } = getUploadU3mResult.data.result
  await putBinaryData(fileUploadUrl, file)
  return { file, fileName, s3UploadId, fileUploadUrl }
}
