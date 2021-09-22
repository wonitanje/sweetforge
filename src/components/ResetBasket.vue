<template>
  <button @click="resetBasket()" :class="{ 'reset-basket': !custom }">
    Сбросить заказ
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ResetBasket',

  props: {
    custom: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    ...mapGetters(['basket'])
  },

  methods: {
    ...mapActions(['updateOrder', 'updateBasket']),

    resetBasket() {
      const order = {
        package: '',
        filled: 0,
        capacity: 0,
        cost: 0,
      }
      this.updateOrder(order)

      this.updateBasket({ sweet: {}, attachment: [] })
    },
  },
}
</script>

<style lang="scss" scoped>
.reset-basket {
  margin: 20px auto;
  padding: 1em 2em;
  text-align: center;
  color: #212121;
  border-radius: 3px;
  background-color: var(--secondary);
  cursor: pointer;
}
</style>