<template>
  <div @click="$emit('event')">
    <input :id="id" :checked="active" type="checkbox" class="asd" />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FilterItem',

  props: {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  padding: 10px;
  width: 100%;
  text-align: left;
  background-color: var(--primary--lite);
  cursor: pointer;

  &:hover {
    background-color: var(--orange-lite);
  }
}
input {
  margin: 0 6px 0 0;
  cursor: pointer;
}
</style>