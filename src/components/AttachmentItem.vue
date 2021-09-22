<template>
  <div @click="toggleAttachment" :class="{ selected: isSelected }" class="item">
    <div class="logo">
      <img @click.stop="openImagePreview" v-lazy="imageName(name)" />
    </div>
    <div class="data">
      <div class="name">{{ name }}</div>
      <div class="price">Цена: {{ price }}р</div>
      <!-- <div class="control">Выбрать</div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { server_url } from '@/env'

export default {
  name: 'PackageItem',

  props: {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
  },

  computed: {
    ...mapGetters(['basket', 'order']),

    isSelected() {
      return this.basket.attachment.includes(this._id)
    },
  },

  methods: {
    ...mapActions(['updateImagePreview', 'popAttachment', 'pushAttachment', 'setCost']),

    imageName: name => `${server_url}/image/attachment/${name.replaceAll(' ', '_').toLowerCase()}.png?scale=3`,
    imageRoot: name => `${server_url}/image/root/${name}.png?scale=1`,

    toggleAttachment() {
      let crement = 1
      if (this.isSelected) {
        this.popAttachment(this._id)
        crement = -1
      } else {
        this.pushAttachment(this._id)
      }
      this.setCost(this.order.cost + this.price * crement)
    },

    openImagePreview() {
      this.updateImagePreview({ key: 'attachment', value: this.name })
      const query = Object.assign({}, this.$route.query, { 'modal': 'imagePreview' })
      this.$router.replace({ query })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/funcs";

.item {
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 320px;
  background: var(--primary-lite);
  border-radius: 6px;
  border: 1px solid transparent;
  box-shadow: var(--separator-shadow);
  transition: all 0.25s ease-in-out;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: var(--orange);
    box-shadow: var(--shadow-size) vara(--orange, 0.35);
  }

  & * {
    transition: color 0.25s;
    cursor: pointer;
  }

  &.selected {
    border-color: var(--green);
    box-shadow: var(--shadow-size) vara(--green, 0.35);

    .logo img {
      filter: drop-shadow(0 0 6px vara(--primary-dark, 0.3))
        drop-shadow(0 0 30px vara(--green, 0.6));
    }
  }

  & > *:not(.logo):hover {
    color: var(--yellow);
  }
}

.logo {
  padding: 8px;
  height: 210px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    filter: drop-shadow(0 0 6px vara(--primary-dark, 0.3));
    cursor: zoom-in;
  }
}

.data {
  flex: 2 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.name {
  flex: 1 0 auto;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}
</style>