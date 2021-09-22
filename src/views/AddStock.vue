<template>
  <form @submit.prevent="submitForm" id="add-stock" action="/add-stock" method="post">
    <select v-model="type" name="type">
      <template v-for="option in Object.keys(getFileds())" :key="option">
        <option :value="option" :selected="type == option">{{ option }}</option>
      </template>
    </select>
    <template v-for="field in getFileds(type)" :key="field">
      <input :name="field" :placeholder="field" type="text" class="input-field">
    </template>
    <button type="submit" class="input-submit">Добавить</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AddStock',

  data() {
    return {
      type: 'Package',
    }
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

    submitForm(e) {
      const form = e.target

      const data = { model: this.type }
      for (let el of form)
        data[el.name] = +el.value || el.value
      delete data['']
      if (data.filter) data.filter = data.filter.split(';').map(el => el.trim(' '))

      axios('/add-stock', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data
      }).then(res => {
        console.log(res.statusText)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#add-stock {
  margin: 50px auto auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
}

.input-field {
  margin: 25px 0 0;
  display: block;
}
</style>