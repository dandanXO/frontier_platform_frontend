const timerMap = {
  getSideBar: null,
}

const fetchWrapper = async ({
  params: { apiEndPoint, token, body = {} },
  path,
}) => {
  const res = await fetch(`${apiEndPoint}${path}`, {
    method: 'post',
    mode: 'cors',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
  })
  return res.json()
}

const apiMap = {
  getSideBar: async (params) => {
    clearTimeout(timerMap.getSideBar)
    const responseData = await fetchWrapper({
      params,
      path: '/polling/sidebar',
    })
    self.postMessage({
      mutation: 'SET_polling',
      data: responseData,
    })
    timerMap.getSideBar = setTimeout(() => {
      apiMap.getSideBar(params)
    }, 30000)
  },
}

self.onmessage = (e) => {
  const { api, params } = e.data

  if (api) {
    apiMap[api](params)
  }
}
