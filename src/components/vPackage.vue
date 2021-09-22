<template>
  <div class="package">
    <div class="inner">
      <template v-for="item in content" :key="item._id">
        <package-item @click.stop="choosePackage(item)" v-bind="item" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PackageItem from '@/components/PackageItem.vue'

export default {
  name: 'vPackage',

  props: {
    content: {
      type: Array,
      required: true,
    }
  },

  components: {
    PackageItem,
  },

  computed: {
    ...mapGetters(['order']),
  },

  methods: {
    ...mapActions(['setPackage', 'setCapacity']),

    choosePackage(item) {
      const redirect = this.order.package.length == 0
      this.setPackage(item._id)
      this.setCapacity(item.capacity)
      if (redirect) this.$router.push({ name: 'sweet' })
    },
  },
}
</script>

<style lang="scss" scoped>
.package,
.attachment {
  margin: 15px 0;
  width: 100%;
  // height: 100%;
  overflow-y: auto;
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 30px;
  height: 100%;
}
</style>