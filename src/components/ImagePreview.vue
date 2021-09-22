<template>
  <div @mousedown.self="closeModal" class="modal image-preview">
    <div class="image-preview__inner">
      <div class="close">
        <span @click.stop="closeModal" class="material-icons-outlined">
          close
        </span>
      </div>
      <img v-lazy="imageName" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { server_url } from '@/env'

export default {
  name: 'ImagePreview',

  emits: ['modal'],

  computed: {
    ...mapGetters(['imagePreview']),

    imageName() {
      return `${server_url}/image/${this.imagePreview.key}/${this.imagePreview.value .replaceAll(' ', '_').toLowerCase()}.png`
    }
  },

  methods: {
    ...mapActions(['updateImagePreview']),

    closeModal() {
      this.$emit('modal', this.updateImagePreview)
    },
  },
}
</script>

<style lang="scss" scoped>
.image-preview {
  &__inner {
    padding: 5px;
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background-color: var(--primary-lite);
    border-radius: 5px;

    .close {
      position: absolute;
      right: 0;
      top: 0;
      color: var(--secondary);
      cursor: pointer;
      z-index: 1;
    }

    img {
      padding: 10px 15px;
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.15));
    }
  }
}
</style>