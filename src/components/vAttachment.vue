<template>
  <div @click.self="close" class="modal attachment">
    <div class="attachment__inner">
      <header class="attachment__header">
        Можете добавить вложения
        <div class="close">
          <span @click.stop="close" class="material-icons-outlined">close</span>
        </div>
      </header>
      <div class="attachment__wrap">
        <div class="attachment__list">
          <template v-for="item in content" :key="item._id">
            <attachment-item v-bind="item" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AttachmentItem from '@/components/AttachmentItem.vue'

export default {
  name: 'vPackage',

  props: {
    content: {
      type: Array,
      required: true,
    }
  },

  components: {
    AttachmentItem,
  },

  methods: {
    close() {
      this.$emit('modal', null)
    }
  },
}
</script>

<style lang="scss" scoped>
.attachment {
  &__inner {
    position: relative;
    width: 80%;
    height: 80%;
    background-color: var(--primary);
    overflow: hidden;
  }

  &__header {
    position: relative;
    padding: 1rem 0;
    width: 100%;
    font-size: 20px;
    border-bottom: 1px solid var(--separator);
  }

  &__wrap {
    padding: 15px 20px;
    width: 100%;
    height: calc(100% - 2rem - 20px);
    overflow-y: auto;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    grid-gap: 30px;
  }
}

@media screen and (max-width: 768px) {
  .attachment {
    &__inner {
      width: 100%;
      height: 100%;
    }
  }
}
</style>