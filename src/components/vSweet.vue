<template>
  <div class="mask">
    <p class="logo">Фото</p>
    <p class="name">Название</p>
    <p class="weight">Вес гр.</p>
    <p class="price">Цена р.</p>
    <p class="control"></p>
  </div>
  <div class="sweet">
    <div class="inner">
      <template v-for="(item, idx) in content" :key="idx">
        <sweet-item v-bind="item" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SweetItem from '@/components/SweetItem.vue' 

export default {
  name: 'vSweet',
  
  props: {
    content: {
      type: Array,
      required: true,
    }
  },

  components: {
    SweetItem,
  },

  created() {
    if (!this.order.package.length && this.$route.name != 'package') {
      this.$router.push({ name: 'package' })
    }
  },

  computed: {
    ...mapGetters(['order'])
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/funcs";

.sweet {
  padding: 0 0 15px;
  width: 100%;
  overflow-y: auto;
}

.inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.mask {
  @include adaptiv-font(16, 14, 768);
  margin: 0 auto;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 97%;
  height: 30px;
  text-align: center;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: none;
  background-color: var(--primary-lite);
  box-shadow: var(--separator-shadow);
  z-index: 1;

  .name {
    padding: 0 0 0 30px;
    flex: 1 1 100%;
    text-align: left;
  }

  .logo,
  .price,
  .weight {
    flex: 0 0 68px;
  }

  .control {
    flex: 0 0 40px;
  }
}

@media screen and (max-width: 768px) {
  .mask {
    @include adaptiv-font-mobile(16, 14, 310);

    .name {
      padding: 0;
    }

    .logo,
    .price,
    .weight {
      flex: 0 0 60px;
    }
  }
}
</style>