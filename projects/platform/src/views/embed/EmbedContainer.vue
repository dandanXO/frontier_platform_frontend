<template lang="pug">
router-view
div(class="fixed z-footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
  img(src="@/assets/images/frontier_logo.png" class="w-20.5 h-4 mr-2")
  p(class="text-body2 text-primary") {{ $t("GG0004") }}
</template>

<script setup>
window.onmessage = (e) => {
  if (e.origin + '/' !== document.referrer) {
    return false
  }

  const { method, params } = e.data

  if (method === 'setToken') {
    const { accessToken, refreshToken } = params
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  } else if (method === 'clearToken') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
</script>
