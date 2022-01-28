export default async function putBinaryData (url = '', data) {
  return await fetch(url, {
    method: 'PUT',
    cache: 'no-cache',
    body: data
  })
}
