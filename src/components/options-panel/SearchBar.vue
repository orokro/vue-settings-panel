<!--
        SearchBar.vue
        -------------

        A simple search input with a clear button.
-->
<script setup>
import { inject } from 'vue'

const searchQuery = inject('searchQuery')

const onInput = (e) => {
  searchQuery.value = e.target.value
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="search-bar">
    <span class="material-icons search-icon">search</span>
    <input 
      type="text" 
      class="search-input" 
      :value="searchQuery" 
      @input="onInput" 
      placeholder="Search settings..."
    />
    <button 
      v-if="searchQuery" 
      class="clear-button" 
      @click="clearSearch"
    >
      <span class="material-icons">close</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--lc-searchBgColor, #fff);
  border-radius: 4px;
  position: relative;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .search-icon {
    font-size: 18px;
    color: var(--lc-searchXColor, #666);
    margin-right: 8px;
    user-select: none;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--lc-searchTextColor, #000);
    outline: none;
    font-size: 14px;
    padding: 4px 0;
    user-select: text;
  }

  .clear-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    color: var(--lc-searchXColor, #666);
    outline: none;

    .material-icons {
      font-size: 16px;
    }

    &:hover {
      color: var(--lc-searchTextColor, #000);
    }
  }
}
</style>
