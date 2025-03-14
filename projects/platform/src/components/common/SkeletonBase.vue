<template lang="pug">
div(class="loader animation--wave" ref="loaderRef")
</template>

<style lang="scss" scoped>
.loader {
  cursor: wait;
  overflow: hidden;
  position: relative;
  background-color: rgba(187, 187, 187, 0.1);
}

@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.loader::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}

.animation--wave::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(187, 187, 187, 0.1) 20%,
    rgba(145, 146, 146, 0.15) 40%,
    rgba(103, 104, 104, 0.18) 60%,
    rgba(61, 62, 62, 0.2) 80%,
    transparent 100%
  );
  width: 200%;
  animation: wave 1.5s ease infinite;
}
</style>
