<style lang="scss" scoped>
.loader,
.loader::before,
.loader::after {
  border-radius: 50%;
  border: 3px solid transparent;
}

.loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-top-color: #51ef0e;
  animation: spin 2s linear infinite;

  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-top-color: #23aa61;
    animation: spin 3s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-top-color: #28e9c8;
    animation: spin 1.5s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="absolute inset-0 bg-black/60 h-full w-full z-10">
    <div class="loader" />
  </div>
</template>
