import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    order: {
      package: '',
      capacity: 0,
      filled: 0,
      cost: 0,
      amount: 20
    },
    basket: {
      sweet: {},
      attachment: []
    },
    filters: {
      package: {
        search: '',
        struct: []
      },
      sweet: {
        search: '',
        sire: [],
        struct: []
      }
    },
    image_preview: null,
    scroll_locked: false,
  },

  mutations: {
    order(state, payload) {
      state.order = payload
    },
    setOrder(state, payload) {
      if (!state.order) state.order = {}
      Object.entries(payload).forEach((kvp) => {
        let [key, val] = kvp
        state.order[key] = val
      })
    },


    basket(state, payload) {
      state.basket = payload
    },
    setBasket(state, payload) {
      state.basket = Object.assign({}, state.basket, payload)
    },
    setSweet(state, payload) {
      if (!state.basket.sweet) state.basket.sweet = {}
      if (!state.basket.sweet[payload.id]) state.basket.sweet[payload.id] = {}
      if (payload.amount != null) state.basket.sweet[payload.id].amount = payload.amount
      if (payload.name != null) state.basket.sweet[payload.id].name = payload.name
    },


    filters(state, payload) {
      state.filters = payload
    },
    setFilter(state, payload) {
      state.filters[payload.type][payload.key] = payload.value
    },


    preload(state, payload) {
      state.preload = payload
    },


    imagePreview(state, payload) {
      state.image_preview = payload
    },


    user(state, payload) {
      state.user = payload
    },
    setUser(state, payload) {
      if (!state.user) state.user = {}
      state.user[payload.key] = payload.value
    },


    notification(state, payload) {
      state.notification = payload
    },
    setNotification(state, payload) {
      state.notification[payload.key] = payload.value
    },


    scrollLock(state, payload) {
      state.scroll_locked = payload
    },
  },

  actions: {
    updateOrder({ commit }, payload) {
      commit('order', payload)
    },
    setOrder({ commit }, payload) {
      commit('setOrder', payload)
    },
    setPackage({ commit }, payload) {
      commit('setOrder', { package: payload })
    },
    setCapacity({ commit }, payload) {
      commit('setOrder', { capacity: payload })
    },
    setFilled({ commit }, payload) {
      commit('setOrder', { filled: payload })
    },
    setCost({ commit }, payload) {
      commit('setOrder', { cost: +payload.toFixed(2) })
    },
    setAmount({ commit }, payload) {
      commit('setOrder', { amount: payload })
    },


    updateBasket({ commit }, payload) {
      commit('basket', payload)
    },
    setSweet({ commit, state }, payload) {
      const item = state.basket.sweet[payload.id] || {}
      if (payload.amount != null) item.amount = payload.amount
      if (payload.name != null) item.name = payload.name
      const obj = {}
      const sweet = Object.assign({}, state.basket.sweet, Object.fromEntries([[payload.id, item]]))
      commit('setBasket', { sweet })
    },
    pushAttachment({ commit, state }, payload) {
      const copy = [...state.basket.attachment, payload]
      commit('setBasket', { attachment: copy })
    },
    popAttachment({ commit, state }, payload) {
      const copy = [...state.basket.attachment]
      const idx = copy.indexOf(payload)
      copy.splice(idx, 1)
      commit('setBasket', { attachment: copy })
    },
    setBasketMany({ commit }, payload) {
      payload.forEach(el => commit('setBasket', el))
    },


    updateFilters({ commit }, payload) {
      commit('filters', payload)
    },
    setFilter({ commit }, payload) {
      commit('setFilter', payload)
    },
    toggleFilter({ commit, state }, payload) {
      let { type, key, value } = payload
      value = value.toLowerCase()
      let category = [].concat(state.filters[type][key])
      const ind = category.indexOf(value)
      if (ind != -1) category.splice(ind, 1)
      else category.push(value)

      commit('setFilter', { type, key, value: category })
    },


    setPreload({ commit }, payload) {
      commit('preload', payload)
    },
    clearPreload({ commit }) {
      commit('preload', null)
    },


    updateImagePreview({ commit }, payload) {
      commit('imagePreview', payload)
    },


    updateUser({ commit }, payload) {
      commit('user', payload)
    },
    setUser({ commit }, payload) {
      commit('setUser', payload)
    },


    updateNotification({ commit }, payload) {
      commit('notification', payload)
    },
    setNotification({ commit }, payload) {
      Object.entries(payload).forEach(({ key, value }) => {
        commit('setNotification', { key, value })
      })
    },


    updateScrollLock({ commit }, payload) {
      commit('scrollLock', payload)
    },
    toggleScrollLock({ commit, state }) {
      commit('scrollLock', !state.scroll_locked)
    },
    unlockScroll({ commit }) {
      commit('scrollLock', false)
    },
    lockScroll({ commit }) {
      commit('scrollLock', true)
    },
  },

  getters: {
    order: state => state.order,
    basket: state => state.basket,
    filters: state => state.filters,
    preload: state => state.preload,
    imagePreview: state => state.image_preview,
    user: state => state.user,
    notification: state => state.notification,
    scrollLocked: state => state.scroll_locked,
  },

  plugins: [
    createPersistedState({
      paths: ['order', 'basket', 'filters', 'user', 'image_preview', 'notification'],
    })
  ],
})
