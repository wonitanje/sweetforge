<template>
  <button @click="resetFilters()" :class="{ 'reset-filters': !custom }">
    Сбросить фильтры
  </button>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ResetFilters',

  props: {
    custom: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    ...mapActions(['updateFilters']),

    resetFilters() {
      const filters = {
        package: {
          search: '',
          struct: [],
        },
        sweet: {
          search: '',
          sire: [],
          struct: [],
        },
      }
      this.updateFilters(filters)
    },
  },
}
</script>

<style lang="scss" scoped>
.reset-filters {
  margin: 20px auto;
  padding: 1em 2em;
  text-align: center;
  color: #212121;
  border-radius: 3px;
  background-color: var(--secondary);
  cursor: pointer;
}
</style>