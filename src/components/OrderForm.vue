<template>
  <div @click.self="closeForm" class="modal form">
    <div class="form__inner">
      <form @submit.prevent="$emit('submit', $event.target)" id="order-form">
        <div class="close">
          <span @click.stop="closeForm" class="material-icons-outlined">
            close
          </span>
        </div>
        <input-mask @change="inputHandler" :value="user.name" :name="'name'"
          >Ваше имя</input-mask
        >
        <input-mobile @change="inputHandler" :value="user.phone" :name="'phone'"
          >Телефон</input-mobile
        >
        <input-mask
          @change="inputHandler"
          :value="user.email"
          :name="'email'"
          :type="'email'"
          >Email</input-mask
        >
        <input-area
          @change="inputHandler"
          :value="user.comment"
          :name="'comment'"
          >Примечание к заказу</input-area
        >
        <form-button>Отправить</form-button>
        <!-- <label for="download">
          <input id="download" name="download" type="checkbox" />
          Скачать файл заказа
        </label> -->
      </form>
      <loading />
    </div>
  </div>
</template>

<script>
import InputMask from '@/components/InputMask.vue'
import InputArea from '@/components/InputArea.vue'
import FormButton from '@/components/FormButton.vue'
import Loading from '@/components/Loading.vue'
import InputMobile from '@/components/InputMobile.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OrderForm',

  components: {
    InputMask,
    InputArea,
    FormButton,
    Loading,
    InputMobile
  },

  props: {
    isCompany: {
      type: Boolean,
      default: false
    }
  },

  emits: ['submit', 'close'],

  // mounted() {
    // if (!this.user) this.updateUser({ key: this.name, value: '' })
  // },

  computed: {
    ...mapGetters(['user']),
  },

  methods: {
    ...mapActions(['setUser']),

    closeForm() {
      this.$emit('modal')
    },

    inputHandler(value, name) {
      this.setUser({ key: name, value })
      console.log('written', value, name)
    }
  }
}
</script>

<style lang="scss" scoped>
.close {
  width: 100%;
  text-align: right;
  color: var(--secondary);

  span {
    cursor: pointer;
  }
}

.form__inner {
  position: relative;
  width: 100%;
  max-width: 450px;
  height: 100%;
  max-height: 550px;
  overflow: auto;
}

#order-form {
  margin: auto;
  padding: 15px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

@media screen and (max-width: 420px) {
  #order-form {
    min-height: 100%;
  }
}
</style>