<template>
  <div class="form-button">
    <button type="submit" class="button">
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Button',
}
</script>

<style lang="scss" scoped>
.form-button {
  margin-top: 15px;
  display: flex;
  width: 100%;
}

.button {
  margin: auto;
  width: 150px;
  height: 52px;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  background: #2045cb;
  transition: all 0.1s ease-in-out;

  &:hover {
    background: #1e41bd;
  }

  &:active {
    background: #18359c;
  }
}
</style>