<template>
  <div class="item">
    <div class="logo">
      <img @click.stop="openImagePreview" v-lazy="imageName(name)" />
    </div>
    <div class="name">{{ sire }} {{ name }}</div>
    <div class="weight">{{ weight }}</div>
    <div class="price">{{ price }}</div>
    <div class="control">
      <button @click.stop="sweetAmount(-1)" class="minus">-</button>
      <input
        v-model="model_value"
        @focus="sweetAmountFocus"
        @change="sweetAmountReverse(basket.sweet[_id].amount)"
        type="tel"
        class="amount"
      />
      <button @click.stop="sweetAmount(1)" class="plus">+</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { server_url } from '@/env'

export default {
  name: 'SweetItem',

  props: {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    sire: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    filter: {
      type: Array,
      default: []
    },
  },

  data() {
    return {
      model_value: 0,
    }
  },

  mounted() {
    if (!this.basket.sweet[this._id])
      this.setSweet({ id: this._id, amount: 0 })

    this.model_value = this.basket.sweet[this._id].amount || 0
  },

  computed: {
    ...mapGetters(['basket', 'order']),

    basketItem() {
      return this.basket.sweet[this._id]?.amount || 0
    }
  },

  methods: {
    ...mapActions(['setSweet', 'setFilled', 'setCost', 'updateImagePreview']),

    imageName: name => `${server_url}/image/sweet/${name.replaceAll(' ', '_').toLowerCase()}.png?scale=3`,
    imageRoot: (name, format='png') => `${server_url}/image/root/${name}.${format}?scale=1&format=${format}`,

    sweetAmount(crement) {
      const value = (this.basket.sweet[this._id]?.amount || 0) + crement
      if (value < 0) return
      this.model_value += crement

      this.setSweet({ id: this._id, amount: value })
      this.setFilled(this.order.filled + this.weight * crement)
      this.setCost(this.order.cost + this.price * crement)
    },

    sweetAmountReverse(oldVal=0) {
      let value = this.model_value - oldVal
      if (this.model_value < 0) {
        value = -oldVal
        this.model_value = 0
      }
      this.setSweet({ id: this._id, amount: this.model_value })
      this.setFilled(this.order.filled + value * this.weight)
      this.setCost(this.order.cost + value * this.price)
    },

    sweetAmountFocus(evt) {
      this.sweet_amount = +evt.target.value
      evt.target.select()
    },

    openImagePreview() {
      this.updateImagePreview({ key: 'sweet', value: this.name })
      const query = Object.assign({}, this.$route.query, { 'modal': 'imagePreview' })
      this.$router.replace({ query })
    },
  },

  watch: {
    basketItem(value) {
      this.model_value = +value || 0
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/funcs";

.item {
  @include adaptiv-font(16, 14, 768);
  margin: 15px auto 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 97%;
  height: 70px;
  text-align: center;
  border-radius: 5px;
  box-shadow: var(--separator-shadow);
  background-color: var(--primary-lite);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.name {
  padding: 0 0 0 30px;
  flex: 1 2 auto;
  text-align: left;
}

.logo {
  padding: 2px;
  transition: 0.2s;

  &:hover {
    background-color: var(--separator-lite);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: zoom-in;
  }
}

.logo,
.price,
.weight {
  flex: 0 1 68px;
}

.control {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  flex: 0 0 40px;
  height: 100%;

  & > * {
    flex: 1 1 100%;
    width: 100%;
  }
  & > button {
    font-size: 15px;
    background-color: var(--separator-lite);
    transition: 0.15s;

    &:hover {
      background-color: var(--separator);
    }
  }
  & > input {
    text-align: center;
    cursor: text;
  }
}

@media screen and (max-width: 768px) {
  .item {
    @include adaptiv-font-mobile(16, 14, 310);
  }

  .name {
    padding: 0 0 0 7px;
  }

  .logo,
  .price,
  .weight {
    flex: 0 1 50px;
  }
}
</style>