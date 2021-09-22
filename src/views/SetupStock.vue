<template>
  <div class="block">
    <input
      v-model="server_port"
      type="text"
      placeholder="Port of local server"
    />
    <select v-model="type">
      <template v-for="option in Object.keys(getFileds())" :key="option">
        <option :value="option" :selected="type == option">{{ option }}</option>
      </template>
    </select>
    <button @click="loadItems()">Load items of {{ type }}</button>
    <button v-if="stock[type]" @click="checkItems()">
      Display items of {{ type }}
    </button>
    <button v-if="stock[type]" @click="importItems()">
      Import all of {{ type }} to database
    </button>
  </div>
</template>

<script>
import axios from 'axios'
import { server_url } from '@/env'

export default {
  name: 'SetupStock',

  inject: ['moshaToast'],

  data() {
    return {
      stock: {},
      type: 'Package',
      server_port: ''
    }
  },

  computed: {
    contentType() {
      return this.$route.name
    },
  },

  methods: {
    getFileds(type=null) {
      const fields = {
        Package: ['name', 'capacity', 'size', 'price', 'filter'],
        Sweet: ['name', 'sire', 'weight', 'price', 'filter'],
        Attachment: ['name', 'price'],
      }

      return fields[type] || fields
    },

    loadItems() {
      Object.prototype.tryParseToNumber = function() {
        return this.map(el => Object.fromEntries(Object.entries(el).map(kvp => [kvp[0], +kvp[1] || kvp[1]])))
      }

      axios(`http://localhost:${this.server_port}/${this.type}`, {
        method: 'get'
      }).then(res => {
        const data = res.data

        this.stock[this.type] = data.tryParseToNumber().map(item => {
          item.filter = (item.filter)
            ? item.filter.split(';').map(el => el.trim(' '))
            : []
          return item
        })
      })
    },

    checkItems() {
      const obj = {}
      obj[this.type] = this.stock[this.type]
      console.log(obj)
    },

    importItems() {
      this.stock[this.type]?.map(item => {
        const data = Object.assign({ model: this.type }, item)

        axios.post(`${server_url}/add-stock`, {
          headers: { 'Content-Type': 'application/json' },
          data
        })
      })
      this.moshaToast({ title: 'Успех', description: 'Контент загружен' }, this.getToastOptions(4000, 'success'))
      axios.get(`${server_url}/get-stock/${this.type}`)
        .then(res => console.log(res.data))
    }
  },
}
</script>

<style lang="scss" scoped>
.block {
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 30px 0;
  font-size: 18px;
}
input {
  padding: 1em 1.5em;
  border: 2px solid #adadad;
  border-radius: 5px;
}
button {
  padding: 1em 1.5em;
  width: auto;
  color: #fff;
  border-radius: 3px;
  background-color: var(--primary-dark);
}
select {
  padding: 0.7em 1.2em;
  font-size: 18px;
  border: 2px solid #adadad;
  border-radius: 5px;
}
</style>