<template>
  <div
    ref="constructor"
    @scroll="contentScrolling"
    class="constructor"
    :class="{ locked: scrollLocked }"
  >
    <div class="head">
      {{ currentHead }}
    </div>
    <div class="constructor__inner">
      <v-sidebar
        :top="sidebar_toggle_pos"
        :structs="currentStructs"
        :sires="currentSires"
        :contentType="contentType"
      />

      <div class="content">
        <router-view :content="slicedContent" />

        <template v-if="contentLength > displayedContentLength">
          <button @click="showMoreIncrement" class="show-more">
            Показать больше
          </button>
        </template>
      </div>
    </div>
    <footer class="footer">
      <p class="copy">&#169;Кузница Сладостей 2015-2021</p>
      <p class="madeby">dev-op wonitanje</p>
    </footer>
  </div>
  <footer v-if="contentType != 'order' && packageSelected" id="footbar">
    <div
      @click.stop="statusHelper"
      class="status"
      :class="{ success: statusSuccess }"
    >
      <span class="status__monitor"
        >{{ order.filled }} / {{ +order.capacity }}</span
      >
      <span class="status__text">{{ statusTitle }}</span>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import { server_url } from '@/env.js'
import vSidebar from '@/components/vSidebar.vue'

export default {
  name: 'Home',

  props: {
    stock_preload: {
      type: Object,
      default: {}
    }
  },

  components: {
    vSidebar,
  },

  mounted() {
    const stock_types = ['sweet', 'attachment']
    if (!this.preload) {
      stock_types.unshift('package')
    } else {
      this.stock.package = this.preload
      this.clearPreload()
    }
    stock_types.forEach(type => {
      console.log(`loading ${type} content`)
      if (this.preload && this.preload[type] && this.preload[type].length > 0)
        return this.stock[type] = this.preload[type]
      axios.get(`${server_url}/get-stock/${type}`)
        .then(res => this.stock[type] = res.data)
    })

    const structs_types = ['package', 'sweet']
    structs_types.forEach(type => axios.get(`${server_url}/get-structs/${type}`).then(res => this.structs[type] = res.data))

    axios.get(`${server_url}/get-sires/sweet`).then(res => this.sires = res.data)
  },

  data() {
    return {
      stock: {},
      show_more: 1,
      structs: {},
      sires: [],
      sidebar_toggle_pos: 50
    }
  },

  computed: {
    ...mapGetters([
      'order',
      'filters',
      'preload',
      'scrollLocked',
    ]),

    package() {
      return this.order.package
    },

    packageSelected() {
      return this.package.length > 0
    },

    contentType() {
      return this.$route.name
    },

    currentStructs() {
      return this.structs[this.contentType] || []
    },

    currentSires() {
      if (this.contentType != 'sweet') return []
      return this.sires
    },

    currentContent() {
      return this.stock[this.contentType] || []
    },

    contentLength() {
      return this.filtredContent?.length || 0
    },

    displayedContentLength() {
      return this.show_more * 25
    },

    filtredContent() {
      const search = this.filters[this.contentType].search.toLowerCase(),
            struct = this.filters[this.contentType].struct,
            sire   = this.filters[this.contentType].sire || ''

      if (!search.length && !struct.length && !sire.length)
        return this.currentContent

      const content = this.currentContent.filter(el => {
        let is_searched = true, is_structed = true, is_sired = true
        if (search.length)
          is_searched = el.sire?.toLowerCase().includes(search) || el.name?.toLowerCase().includes(search)

        if (sire.length)
          is_sired = sire.includes(el.sire?.toLowerCase())

        if (struct.length) {
          if (!el.filter?.length) return false
          const flat = el.filter.map(el => struct.includes(el.toLowerCase()))
          is_structed = flat.reduce((res, el) => res || el)
        }
        return is_searched && is_structed && is_sired
      })

      return content
    },

    slicedContent() {
      return this.filtredContent.slice(0, this.displayedContentLength)
    },

    currentHead() {
      const heads = {
        package: 'Вам нужно выбрать упаковку подарка.',
        sweet: 'Теперь нужно набрать сладостей.',
      }

      return heads[this.contentType]
    },

    statusSuccess() {
      return this.order.filled >= 300 && this.order.filled <= this.order.capacity + 20
    },

    statusTitle() {
      if (this.order.filled < 300)
        return 'Недобор веса'
      if (this.order.filled <= this.order.capacity + 20)
        return 'Продолжить'
      return 'Перебор веса'
    },
  },

  methods: {
    ...mapActions(['clearPreload']),

    imageName: (type, name) => `/images/${type}/${name.replaceAll(' ', '_').toLowerCase()}.png`,

    contentScrolling(e) {
      if (e.target.scrollTop >= 44) this.sidebar_toggle_pos = 80
      else this.sidebar_toggle_pos = 50
    },

    showMoreIncrement() {
      this.show_more++
    },

    statusHelper() {
      if (!this.statusSuccess || this.contentType == 'package') 
        return this.$router.push({ name: 'sweet' })
      this.$router.push({ name: 'order' })
    }
  },

  watch: {
    contentType(type) {
      this.$refs.constructor.scrollTop = 0
      this.show_more = 1
      if (this.order.package == -1 && type != 'package')
        this.$router.push({ name: 'package' })
    },
  },
}
</script>

<style lang="scss" scoped>
.constructor {
  position: relative;
  width: 100%;
  flex: 1 1 auto;
  max-height: calc(100% - var(--h-navbar));
  overflow-y: auto;

  &__inner {
    display: flex;
    width: 100%;
    min-height: calc(100% - 5em);
  }
}

.content {
  padding: 0 15px 15px;
  flex: 1 1 auto;
}

.head {
  padding: 0 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 3em;
  font-size: 18px;
  border-bottom: 1px solid var(--separator);
}

.show-more {
  padding: 1em 2em;
  width: auto;
  color: #fff;
  border-radius: 3px;
  background-color: var(--primary-dark);
}

footer {
  background-color: var(--primary-dark);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 2em;
  color: #fff;
}

#footbar {
  position: sticky;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 0 0 40px;

  .status {
    padding: 5px;
    display: flex;
    align-items: center;
    height: calc(100% - 10px);
    border-radius: 3px;
    background-color: var(--secondary);
    box-shadow: var(--separator-shadow);
    cursor: pointer;
    transition: 0.3s;

    &.success {
      background-color: var(--green);
    }

    &__monitor {
      padding: 3px 8px;
      border-radius: 3px;
      background-color: #fff;
      cursor: inherit;
    }

    &__text {
      padding: 3px 5px;
      cursor: inherit;
    }
  }
}

@media screen and (max-width: 768px) {
  .constructor.locked {
    overflow: hidden;
  }
}
</style>