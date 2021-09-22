<template>
  <div
    @mousedown.self="$emit('modal', updateNotification)"
    class="modal notification"
  >
    <div class="notification__inner">
      <header>
        {{ notification.head }}
        <span
          @click.stop="$emit('modal')"
          class="close material-icons-outlined"
        >
          close
        </span>
      </header>
      <div v-if="notification.html" v-html="notification.html" class="html" />
      <div v-else-if="notification.body" class="body">
        {{ notification.body }}
      </div>
      <div v-else-if="notification.slot" class="body">
        <slot />
      </div>
      <div v-else class="loading"><p>Загрузка</p></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'VNotification',

  emits: ['modal'],

  computed: {
    ...mapGetters(['notification']),
  },

  methods: {
    ...mapActions(['updateNotification']),
  }
}
</script>

<style lang="scss" scoped>
.notification {
  &__inner {
    background-color: var(--primary);
    border-radius: 3px;

    header {
      padding: 7px 10px;
      position: relative;
      font-size: 22px;
      border-bottom: 1px solid var(--primary-dark);

      .close {
        position: absolute;
        right: 7px;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: var(--secondary);
        cursor: pointer;
      }
    }

    .body,
    .html,
    .loading {
      padding: 10px 20px;
    }

    p {
      margin: 0 0 10px;
    }
  }
}
</style>