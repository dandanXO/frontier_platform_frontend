<template lang="pug">
div(class="home")
  p(class="primary--text f-h1") {{ $t("message") }}
  img(alt="Vue logo" src="@/assets/logo.png")
</template>

<script>

export default {
  name: 'Home'
}
</script>
