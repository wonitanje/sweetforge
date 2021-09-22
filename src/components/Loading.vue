<template>
  <div class="loading">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: none;
  justify-content: center;
  background: rgba(3, 3, 3, 0.4);
}
.lds-ring {
  margin: auto;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  margin: 8px;
  position: absolute;
  display: block;
  width: 64px;
  height: 64px;
  border: 8px solid #fff;
  border-radius: 50%;
  border-color: #fff transparent transparent transparent;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>