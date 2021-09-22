<template>
  <div class="steps">
    <template v-for="step in contentSteps" :key="step.id">
      <div
        @click="changeStep(step.component)"
        :to="{ name: step.component }"
        :class="{
          active: step.active,
          locked: step.locked,
          success: step.success,
        }"
        class="steps__item"
      >
        <div class="steps__id">{{ step.id }}</div>
        <p class="steps__title">{{ step.name }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',

  computed: {
    ...mapGetters([
      'order',
    ]),

    contentType() {
      return this.$route.name
    },

    contentSteps() {
      const steps = {
        package: { id: 1, name: 'Упаковка', logo: 'redeem', component: 'package', locked: false },
        sweet: { id: 2, name: 'Сладости', logo: 'cake', component: 'sweet', locked: true },
        order: { id: 3, name: 'Заказ', logo: 'credit_card', component: 'order', locked: true },
      }

      if (this.order.package.length) {
        steps.sweet.locked = false
      }

      if (this.order.filled >= 300 && this.order.capacity >= this.order.filled) {
        steps.order.locked = false
      }

      steps[this.contentType].active = true

      return steps
    },
  },

  methods: {
    changeStep(component) {
      if (this.contentSteps[component].locked) return

      this.$router.push({ name: component })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/funcs";

.steps {
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  &__item {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: var(--w-step);
    height: 50px;
    border-radius: 2em;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: var(--separator-shadow);
    background-color: #fff;
    transition: all 0.25s ease, border 0.1s linear;
    cursor: pointer;

    &:not(:last-child) {
      margin: 0 0 1.5em 0;
    }

    &:not(.locked):hover {
      background-color: var(--orange-lite);
    }

    &.locked {
      background-color: var(--separator);
      border-color: #888;
      cursor: default;

      &::before {
        background-color: #888;
      }
    }

    &.active {
      background-color: var(--orange-lite);
    }

    * {
      cursor: inherit;
    }

    &::before {
      content: "";
      position: absolute;
      display: block;
      width: 3px;
      height: 1.5em;
      bottom: 100%;
      left: 50%;
      transform: translate(-50%, -1px);
      background-color: #dadada;
      transition: 0.25s ease-in-out;
      z-index: 0;
    }

    &:first-child {
      &::before {
        display: none;
      }
    }
  }

  &__id {
    flex: 0 0 46px;
    font-size: 24px;
  }

  &__title {
    padding: 0 15px 0 0;
    flex: 1 1 auto;
    font-size: 18px;
  }
}
</style>