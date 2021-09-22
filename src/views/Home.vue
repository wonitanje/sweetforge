<template>
  <div class="block">
    <div class="inner">
      <div class="welcome">
        <p>Вы зашли в конструктор сладкого подарка Кузницы Сладостей</p>
        <p>Здесь Вы сможете сформировать свой состав подарка</p>
        <button>
          <router-link :to="{ name: 'constructor' }">
            К конструктору
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import { server_url } from '@/env.js'

export default {
  name: 'Home',

  mounted() {
    axios.get(`${server_url}/get-stock/package`)
      .then(({ data }) => {
        this.setPreload(data)
        console.log('preload package', data)
      })

    const order = {
      package: '',
      filled: 0,
      capacity: 0,
      cost: 0,
      amount: 20
    }
    this.updateOrder(order)

    this.updateBasket({ sweet: {}, attachment: [] })

    const filters = {
      package: {
        search: '',
        struct: [],
      },
      sweet: {
        search: '',
        sire: [],
        struct: [],
      }
    }
    this.updateFilters(filters)

    this.updateUser({})
  },

  computed: {
    ...mapGetters(['preload']),
  },

  methods: {
    ...mapActions(['setPreload', 'updateOrder', 'updateBasket', 'updateFilters', 'updateUser']),
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/funcs";

.block {
  height: 100%;
  background-image: url("/images/home.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.inner {
  @include adaptiv-font(30, 20, 310);
  display: flex;
  align-content: center;
  width: 100%;
  height: 100%;
  color: #000;
  background-color: rgba(255, 255, 255, 0.2);
}
.welcome {
  margin: auto;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 30px 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
p:last-child {
  margin: 0 0 40px;
}
button {
  margin: 40px 0 0;
  padding: 0.5em 0.7em;
  border-radius: 5px;
  background-color: var(--secondary);
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.6);
}
a {
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>