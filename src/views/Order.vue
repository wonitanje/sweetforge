<template>
  <div class="order" :class="{ locked: scrollLocked }">
    <div class="inner">
      <div class="o-left">
        <div class="block package">
          <p class="title">Ваша упаковка</p>
          <img :src="imageName('package', package_name || '')" alt="" />
          <button @click.stop="openPreview" class="open-attachment">
            Посмотреть вложения
          </button>
        </div>
      </div>
      <div class="o-right">
        <div class="block info">
          <div class="head">
            <p class="title left">Информация о заказе</p>
            <span @click="shareOrder" class="material-icons-outlined">
              share
            </span>
          </div>
          <div class="info-line">
            <p class="text left">
              <strong>Название упаковки:</strong>
              {{ packageName }}
            </p>
            <p class="text left">
              <strong>Вес подарка:</strong> {{ filled }} грамм
            </p>
            <p class="text left">
              <strong>Стоимость подарка:</strong> {{ fixedPrice }} рублей
            </p>
            <p class="text left">
              <strong>Количество подарков: </strong>
              <input v-model.lazy="order_amount" class="amount" type="number" />
            </p>
          </div>
          <p class="text right info-right">Стоимость: {{ fullPrice }} руб.</p>
        </div>
        <div class="block structure">
          <p class="title left">Состав заказа</p>
          <div class="item mask">
            <p class="amount">шт</p>
            <p class="name">Название</p>
            <p class="counter">№</p>
          </div>
          <div
            v-for="({ amount, name }, ind) of basketContent"
            :key="ind"
            class="item"
          >
            <p class="amount">{{ amount }}</p>
            <p class="name">{{ name }}</p>
            <p class="counter">{{ ind + 1 }}</p>
          </div>
          <div class="btns">
            <button @click="openOrderForm(false)" id="self" class="btn">
              Оставить заявку
            </button>
            <button @click="toConstructor" class="btn">
              Вернуться в конструктор
            </button>
            <!-- <button @click="openOrderForm(true)" id="company" class="btn">
              Выставить счет
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <transition name="fade">
    <OrderForm
      v-if="openedModal == 'orderForm'"
      @modal="closeModal"
      @submit="submitOrder"
      :isCompany="order_form_is_company"
    />
  </transition>
  <transition name="fade">
    <v-attachment
      v-if="isPreviewOpened == 'attachment'"
      @modal="closePreview"
      :content="attachment_content"
    />
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import { server_url } from '@/env.js'
import ImagePreview from '@/components/ImagePreview.vue'
import OrderForm from '@/components/OrderForm.vue'
import vAttachment from '@/components/vAttachment.vue'

export default {
  name: 'Order',

  components: {
    ImagePreview,
    OrderForm,
    vAttachment,
  },

  emits: ['modal'],

  inject: ['moshaToast'],

  async mounted() {
    this.order_amount = this.order.amount

    await axios.get(`${server_url}/get-stock/attachment`)
      .then(res => this.attachment_content = res.data)

    if (this.basket.attachment.length == 0)
      this.openPreview()
  },

  data() {
    return {
      package_name: '',
      order_basket: {},
      order_form_is_company: false,
      order_amount: 0,
      attachment_content: [],
    }
  },

  created() {
    if (this.order.package.length == 0) {
      return this.$router.push({ name: 'package' })
    }
    if (this.order.filled < 300 || this.order.filled > this.order.capacity + 20) {
      return this.$router.push({ name: 'sweet' })
    }

    axios(`${server_url}/getbyid`, {
      method: 'get',
      params: { type: 'package', id: this.order.package, props: ['name'] }
    }).then(res => this.package_name = res.data.name)

    let basket_items = Object.entries(this.basket.sweet).filter(el => el[1].amount).map(el => el[0])
    axios(`${server_url}/getbyids`, {
      method: 'get',
      params: { ids: basket_items, type: 'sweet', props: ['_id', 'name'] }
    }).then(res => res.data.forEach(el => this.setSweet({ id: el._id, name: el.name })))

    if (!this.user) this.updateUser({})
  },

  computed: {
    ...mapGetters(['order', 'basket', 'user', 'scrollLocked']),

    packageName() {
      return this.package_name || this.order.package
    },

    filled() {
      return this.order.filled
    },

    fixedPrice() {
      const price = this.order.cost
      return +price.toFixed(2)
    },

    fullPrice() {
      const price = this.fixedPrice * this.order.amount
      return price.toFixed(2)
    },

    basketContent() {
      return Object.values(this.basket.sweet).filter(el => el.amount > 0)
    },

    openedModal() {
      return this.$route.query.modal
    },

    isPreviewOpened() {
      return this.$route.query.preview
    },
  },

  methods: {
    ...mapActions(['setSweet', 'setAmount', 'updateUser']),

    imageName: (type, name) => `/images/${type}/${name.replaceAll(' ', '_').toLowerCase()}.png`,

    toConstructor() {
      this.$router.push({ name: 'sweet' })
    },

    openOrderForm(is_company) {
      this.order_form_is_company = is_company
      this.openModal('orderForm')
    },

    openModal(name) {
      const query = Object.assign({}, this.$route.query, { modal: name })
      this.$router.replace({ query })
      // this.lockScroll()
    },

    closeModal() {
      this.$emit('modal', null)
      // this.unlockScroll()
    },

    deleteQuery(key) {
      let query = Object.assign({}, this.$route.query)
      delete query[key]
      if (Object.keys(query).length == 0) query = null
      return query
    },

    openPreview() {
      const query = Object.assign({}, this.$route.query, { preview: 'attachment' })
      this.$router.replace({ query })
    },
    
    closePreview() {
      this.$router.replace({ query: this.deleteQuery('preview') })
    },

    async saveOrder() {
      const basket = { sweet: {}, attachment: this.basket.attachment }
      for (const key in this.basket.sweet)
        if (this.basket.sweet[key].amount > 0)
          basket.sweet[key] = { amount: this.basket.sweet[key].amount }

      const options = {
        basket,
        order: this.order,
        user: this.user,
      }

      const id = await axios.post(`${server_url}/save-order`, options).then(res => res.data)

      return id
    },

    async submitOrder(container) {
      console.log('container', container)
      let loader = this.$loading.show({ container, canCancel: false })
      const id = await this.saveOrder()
      console.log(id)
      const status = await axios.post(`${server_url}/send-order/${id}`)
        .then(res => res.status)
        .catch(err => err.response.statusText)
      loader.hide()
      let notify = { title: 'Успешно', description: 'Заказ успешно отправлен' }
      let type = 'success'
      if (status !== 200) {
        notify = { title: 'Неудачно', description: `Заказ не был отправлен. ${status}` }
        type = 'danger'
      }
      this.moshaToast(notify, this.getToastOptions(4000, type))
      this.$emit('modal', null)
    },

    async shareOrder() {
      const loader = this.$loading.show({ container: document.querySelector('#app'), canCancel: true })
      const id = await this.saveOrder()
      const url = `${location.origin}/share-link/${id}`
      const html_url = url.split('/').join('/<wbr>')

      const notify = {
        title: 'Ваша ссылка готова',
        description: `<p onclick="toClipboard('${url}')" class="link">${html_url}<span class="material-icons-outlined">content_copy</span></p>` 
      }
      this.moshaToast(notify, this.getToastOptions(20000))
      loader.hide()
    },

    getToastOptions: (timeout, type='default') => ({
      position: 'bottom-right',
      type,
      transition: 'bounce',
      timeout,
    }),
  },

  watch: {
    order_amount(value) {
      if (value < 20)
        return this.order_amount = 20
      this.setAmount(value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/funcs";

.order {
  padding: 30px 15px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  grid-gap: 30px;
  width: 100%;
  height: auto;
}

.open-attachment {
  padding: 0.5em 0.8em;
  color: #fff;
  border-radius: 3px;
  border: 2px var(--primary-dark) outset;
  background-color: var(--primary-dark);
}

.block {
  background-color: var(--primary-lite);
  box-shadow: var(--separator-shadow);
  border-radius: 8px;
}

.o-left {
  flex: 0 0 300px;
  max-width: 100%;
  height: auto;
}

.o-right {
  flex: 1 0 424px;
  max-width: 100%;
}

.package {
  padding: 10px 15px;
  position: sticky;
  top: 0;

  .title {
    text-align: left;
  }

  img {
    max-width: 100%;
    object-fit: contain;
  }
}

.info {
  padding: 10px 15px 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  grid-gap: 10px;

  &-line {
    flex: 1 1 auto;
    display: inline;
  }

  .head {
    margin: 0 0 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .title {
      padding: 0;
      width: auto;
    }

    span {
      cursor: pointer;
    }
  }

  .left {
    flex: 1 1 auto;
    text-align: left;
  }

  .right {
    padding: 8px 13px;
    justify-self: flex-end;
    flex: none;
    border-radius: 3px;
    border: 1px inset var(--primary);
    background-color: var(--primary);
    text-shadow: 0 0 30px var(--primary);
  }

  .amount {
    padding: 2px;
    width: 80px;
    border-radius: 3px;
    border: 1px solid var(--separator);
    overflow: hidden;
  }
}

.structure {
  margin: 30px 0 0;
  padding: 10px 0 0;

  & > .title {
    padding: 0 15px 15px;
  }
}

.item {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > p {
    padding: 10px 4px;
    flex: 0 0 36px;
    text-align: center;
  }

  &.mask {
    color: #212121;
    background-color: var(--primary-lite);

    & > p {
      padding: 2px 4px;
    }
  }

  &:nth-child(odd) {
    background-color: var(--separator-lite);
  }

  .amount {
    text-align: right;
  }

  .name {
    flex: 1 1 auto;
    text-align: left;
  }
}

.btns {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
}

.btn {
  margin: 15px 0 0;
  padding: 7px 12px;
  color: #fff;
  border-radius: 3px;
  border: 2px var(--primary-dark) outset;
  background-color: var(--primary-dark);
  transition: 0.5s;

  &:active {
    border-style: inset;
  }

  &:nth-child(1) {
    background-color: var(--secondary);
    border-color: var(--secondary);

    &:hover {
      background-color: var(--primary-dark);
      border-color: var(--primary-dark);
    }
  }

  &:hover {
    background-color: var(--secondary);
    border-color: var(--secondary);
  }
}
@media screen and (max-width: 930px) {
  .o-left {
    flex: 1 1 auto;
  }
}

@media screen and (max-width: 768px) {
  .order.locked {
    overflow: hidden;
  }
}

@media screen and (max-width: 400px) {
  .btns {
    flex-direction: column;
  }
}
</style>