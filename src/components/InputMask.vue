<template>
  <div class="input-wrap">
    <input
      @focus="focus"
      @focusout="unfocus"
      @change="inputChanged"
      :id="name"
      :type="type"
      :value="value"
      class="form-input"
    />
    <label :for="name" :class="{ active: value }" class="form-label">
      <slot></slot>
    </label>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'InputMask',

  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    }
  },

  // mounted() {
  //   if (!this.user) this.setUser({ key: this.name, value: '' })
  // },

  // computed: {
  //   ...mapGetters(['user']),

  //   value() {
  //     if (!this.user) return ''
  //     return this.user[this.name] 
  //   }
  // },

  methods: {
    // ...mapActions(['setUser']),

    inputChanged(e) {
      this.$emit('change', e.target.value, this.name)
    },

    focus(e) {
      e.target.labels[0].classList.add('active')
      e.target.labels[0].classList.add('focus')
    },

    unfocus(e) {
      if (!e.target.value) {
        e.target.labels[0].classList.remove('active')
      }

      e.target.labels[0].classList.remove('focus')
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  cursor: text;
}

.input-wrap {
  margin: 15px auto;
  position: relative;
  width: 100%;
  max-height: 30%;

  &:first-child {
    margin-top: 0;
  }

  &.wrong {
    label {
      color: #ed414f;
    }
    input,
    textarea {
      border-color: #ed414f;
    }
  }
}

.form-input {
  padding: 10px;
  padding-top: 22px;
  width: 100%;
  height: 100%;
  max-height: 55px;
  font: 16px "Roboto" 500;
  outline: none;
  border: solid 1px #dde1e6;
  border-radius: 4px;
  transition: border 0.2s ease-in-out;

  &:hover {
    border: solid 1px #b4bbc3;
  }

  &:focus {
    border: solid 1px #6eaffe;
  }
}

.form-label {
  position: absolute;
  color: #848e99;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;
  pointer-events: none;

  &.active {
    font-size: 12px;
    top: 12px;
    left: 12px;
  }

  &.focus {
    color: #6eaffe;
  }
}
</style>