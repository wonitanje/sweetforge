<template>
  <v-navbar
    :logo="'/images/logo.png'"
    :logo_text="'Кузница Сладостей'"
    :contacts="nav_contacts"
    :links="nav_links"
  />
  <router-view @modal="closeModal(payload)" />
  <transition name="fade">
    <image-preview
      v-if="openedModal == 'imagePreview' && imagePreview?.value"
      @modal="closeModal(payload)"
    />
  </transition>
  <transition name="fade">
    <v-notification
      v-if="openedModal == 'notification' && notification"
      @modal="closeModal(payload)"
    />
  </transition>
</template>

// ToDo List
// [ ] Add back listeners (close modal on back and esc)
// [ ] Check form data (backend)
// [ ] Vuelidate on order form
// [ ] Generate pdf instead excel
// [ ] Display attachments on order page in order structure
// [ ] 

<script>
import { mapActions, mapGetters } from 'vuex'
import vNavbar from '@/components/vNavbar.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import VNotification from '@/components/VNotification.vue'

export default {
  name: 'App',

  components: {
    vNavbar,
    ImagePreview,
    VNotification,
  },

  setup() {
    const nav_contacts = [
      {
        name: '+73843583280',
        href: 'tel:+73843583280',
        logo: 'call',
      },
      {
        name: 'nvkz@kuzs.ru',
        href: 'mailto:nvkz@kuzs.ru',
        logo: 'mail',
      }
    ]
    const nav_links = [
      { name: 'Каталог', href: 'https://www.kuzs.ru/catalog' },
      { name: 'Контакты', href: 'https://www.kuzs.ru/contacts' },
      { name: 'О компании', href: 'https://www.kuzs.ru/company' },
      { name: 'Наш блог', href: 'https://www.kuzs.ru/blog' },
    ]

    return { nav_contacts, nav_links }
  },

  computed: {
    ...mapGetters(['imagePreview', 'notification']),

    openedModal() {
      return this.$route.query.modal
    },
  },

  methods: {
    ...mapActions(['updateImagePreview', 'updateNotification', 'updateScrollLock']),

    deleteQuery(key) {
      let query = Object.assign({}, this.$route.query)
      delete query[key]
      if (Object.keys(query).length == 0) query = null

      return query
    },

    closeModal(reset) {
      if (reset) reset(null)
      this.$router.replace({ query: this.deleteQuery('modal') })
    },
  },

  watch: {
    '$route.query'(query) {
      this.updateScrollLock(query.modal != null)
    }
  },
}
</script>

<style lang="scss">
@import "assets/scss/funcs";
@import "assets/scss/vars";
@import "@/assets/scss/null";

.material-icons {
  font-size: 2em;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: #212121;
  font-family: "PT Sans", "Helvetica Neue", "Roboto", Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  text-align: center;
  background-color: var(--primary);
}

.container {
  margin: 0 auto;
  padding: 0 10px;
  width: 100%;
  max-width: 1200px;
}

*::placeholder {
  color: var(--grey);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: var(--z-modal);
  cursor: pointer;

  & > * {
    border-radius: 2px;
    box-shadow: 0 0 2px var(--primary-dark);
    background: var(--primary-lite);
  }
}

.close {
  position: absolute;
  right: 5px;
  top: 5px;
  color: var(--secondary);
  cursor: pointer;
  z-index: 1;
}

.title {
  padding: 0 0 15px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
}
.text {
  font-size: 16px;
  text-align: center;
  line-height: 1.5em;
}
.title,
.text {
  &.left {
    text-align: left;
  }
  &.right {
    text-align: right;
  }
}

.link {
  margin: 10px 0 0;
  padding: 5px 8px;
  position: relative;
  border-radius: 3px;
  border: 1px solid var(--separator);
  cursor: pointer;

  span {
    display: none;
    cursor: inherit;
  }

  &:hover {
    span {
      padding: 0 3px;
      position: absolute;
      top: 50%;
      right: 0;
      display: block;
      text-align: center;
      transform: translateY(-50%) scale(0.7);
    }
  }
}

.material-icons-outlined {
  cursor: inherit;
}

img {
  &[lazy="loading"],
  &[lazy="error"] {
    filter: none !important;
    transform: scale(0.6) !important;
  }
}

.mosha__toast {
  &.danger {
    background-color: var(--secondary) !important;
  }
  &.warning {
    background-color: var(--yellow) !important;
  }

  &__progress {
    height: 4px !important;
  }

  &__close-icon {
    position: absolute;
    top: 0;
    right: 5px;
    cursor: pointer;

    &::before {
      position: static !important;
      margin-left: 0 !important;
    }
    &:hover::before {
      color: var(--secondary) !important;
    }
  }

  &__content {
    font-family: "PT Sans", "Helvetica Neue", "Roboto", Helvetica, Arial,
      sans-serif;
    color: #212121 !important;

    &__text {
      font-size: 20px;
    }

    &__description {
      font-size: 16px;
    }
  }
}

.vld-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgba(3, 3, 3, 0.16);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
