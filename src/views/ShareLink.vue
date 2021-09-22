<template>
  <p class="title">Загрузка данных</p>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'
import { server_url } from '@/env.js'

export default {
  name: 'Home',

  async created() {
    const { basket, order } = await axios(`${server_url}/get-order/${this.$route.params.id}`).then(res => res.data)
    await this.updateOrder(order)
    await this.updateBasket(basket)
    await this.updateUser(null)
    this.$router.push({ name: 'constructor' })
  },

  methods: {
    ...mapActions(['updateOrder', 'updateBasket', 'updateUser']),
  }
}
</script>

<style scoped>
.title {
  margin: 50px 0 0;
}
</style>