<template>
  <div :class="{ active: sidebar_active }" class="sidebar">
    <div class="sidebar__inner">
      <div
        @click.stop="toggleSidebar"
        class="material-icons-outlined toggle"
        :style="{ top: `${top}px` }"
      >
        filter_list
      </div>

      <content-steps />

      <div
        @click.self="toggleAction"
        :class="{ active: action_active }"
        class="block action"
      >
        <p class="head">Действие</p>
        <div class="body">
          <reset-filters :custom="true" />
          <reset-basket :custom="true" />
        </div>
      </div>
      <div class="search">
        <input
          v-model="search_field"
          type="text"
          class="search__field"
          placeholder="Поиск по каталогу"
        />
      </div>
      <div class="filters">
        <div
          v-if="sires.length"
          :class="{ active: filter_active[contentType].sire }"
          class="block"
        >
          <p @click.stop="toggleSire" class="head">Производитель</p>
          <template v-for="(sire, idx) in sires" :key="idx">
            <filter-item
              @event="
                toggleFilter({
                  type: contentType,
                  key: 'sire',
                  value: sire,
                })
              "
              :active="isFilterActive('sire', sire)"
              :id="`sire${idx}`"
              >{{ sire }}</filter-item
            >
          </template>
        </div>
        <div
          :class="{ active: filter_active[contentType].struct }"
          class="block"
        >
          <p @click.stop="toggleStruct" class="head">
            {{ struct_title[contentType] }}
          </p>
          <template v-for="(struct, idx) in structs" :key="idx">
            <filter-item
              @event="
                toggleFilter({
                  type: contentType,
                  key: 'struct',
                  value: struct,
                })
              "
              :active="isFilterActive('struct', struct)"
              :id="`struct${idx}`"
              >{{ struct }}</filter-item
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ContentSteps from '@/components/ContentSteps.vue'
import FilterItem from '@/components/FilterItem.vue'
import ResetFilters from '@/components/ResetFilters.vue'
import ResetBasket from '@/components/ResetBasket.vue'

export default {
  name: 'vFilters',

  props: {
    structs: {
      type: Array,
      required: true,
    },
    sires: {
      type: Array,
      required: true,
    },
    top: {
      type: Number,
      default: 50,
    },
    contentType: {
      type: String,
      required: true
    }
  },

  components: {  
    ContentSteps,
    FilterItem,
    ResetFilters,
    ResetBasket,
  },

  setup() {
    return {
      struct_title: {
        package: 'Материал',
        sweet: 'Классификация'
      },
    }
  },

  mounted() {
    this.search_field = this.filters[this.contentType].search || ''
  },

  data() {
    return {
      sidebar_active: false,
      filter_active: {
        package: {
          struct: true,
        },
        sweet: {
          sire: true,
          struct: false,
        }
      },
      action_active: true,
      search_field: '',
    }
  },

  computed: {
    ...mapGetters(['filters']),

    searchState() {
      return this.filters[this.contentType].search
    }
  },

  methods: {
    ...mapActions(['setFilter', 'toggleFilter', 'updateScrollLock']),

    toggleStruct() {
      this.filter_active[this.contentType].struct = !this.filter_active[this.contentType].struct
    },
    toggleSire() {
      this.filter_active[this.contentType].sire = !this.filter_active[this.contentType].sire
    },
    toggleAction() {
      this.action_active = !this.action_active
    },

    toggleSidebar() {
      this.sidebar_active = !this.sidebar_active
      this.updateScrollLock(this.sidebar_active)
    },

    isFilterActive(type, value) {
      return this.filters[this.contentType][type]?.includes(value.toLowerCase()) || false
    }
  },

  watch: {
    search_field(value) {
      this.setFilter({ type: this.contentType, key: 'search', value })
    },

    searchState(value) {
      this.search_field = value
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 15px;
  flex: 0 0 250px;
  background-color: var(--primary);
  overflow-y: auto;

  &__inner {
    margin: 0 auto;
    width: 100%;
  }
}
.toggle {
  display: none;
}

.search {
  margin: 0 0 10px;
  width: 100%;
  height: 2.5em;
  background-color: var(--primary-lite);

  &__field {
    padding: 0 12px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 15px;
    border-radius: 8px;
    box-shadow: var(--separator-shadow);
    cursor: text;
  }
}

.filters {
  border-radius: 8px;
  box-shadow: var(--separator-shadow);
  background-color: var(--primary-lite);
  overflow: hidden;
}
.block {
  height: 3em;
  overflow: hidden;

  &.active {
    height: auto;

    .head {
      &::before {
        transform: translate(-2px, -50%) rotate(-45deg);
      }
      &::after {
        transform: translate(50%, -50%) rotate(45deg);
      }
    }
  }

  &:last-child {
    border-bottom: none;
  }

  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 3em;
    font-size: 16px;
    font-weight: bold;
    transition: 0.35s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: var(--orange-lite);

      &::before,
      &::after {
        background-color: var(--orange);
      }
    }

    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      right: 12px;
      width: 12px;
      height: 2px;
      background-color: var(--separator);
      transform: translate(-2px, -50%) rotate(45deg);
      transition: 0.25s;
    }
    &::after {
      transform: translate(50%, -50%) rotate(-45deg);
    }
  }
}

.action {
  margin: 0 0 10px;
  height: 2.5em;
  border-radius: 8px;
  box-shadow: var(--separator-shadow);
  background-color: var(--primary-lite);
  overflow: hidden;

  .head {
    height: 2.5em;
  }

  .body > * {
    padding: 10px 12px;
    width: 100%;
    background-color: var(--primary-lite);

    &:hover {
      background-color: var(--orange-lite);
    }
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: var(--h-navbar-tablet);
    right: 100%;
    width: 100%;
    height: calc(100% - var(--h-navbar));
    transition: 0.3s;
    z-index: var(--z-sidebar);

    &.active {
      right: 0;
    }

    &__inner {
      width: 300px;
      max-width: 100%;
    }
  }
  .toggle {
    position: fixed;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: var(--primary-lite);
    box-shadow: var(--separator-shadow);
    // z-index: calc(var(--z-sidebar) + 1);
    transition: 0.3s ease-out;
  }
}
</style>