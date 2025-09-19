<template>
  <div class="list-container">
    <div class="list-header">
      <h3 class="list-title">Items</h3>
      <div v-if="totalItems > 0" class="header-buttons">
        <button @click="copyList" class="icon-button copy-button" :title="copyButtonTitle">
          {{ isCopied ? '✓' : '📋' }}
        </button>
        <button @click="handleReset" class="icon-button reset-button">↻</button>
      </div>
    </div>

    <div class="list-wrapper">
      <transition-group name="list" tag="div" class="items-list">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="list-item"
          :class="{
            highlighted: isItemHighlighted(item.id),
            'moving-up': item.animationDirection === 'up',
            'moving-down': item.animationDirection === 'down',
          }"
        >
          <span class="item-rank">{{ index + 1 }}</span>
          <span class="item-text">{{ item.text }}</span>
        </div>
      </transition-group>
    </div>

    <div v-if="items.length === 0" class="empty-state">No items</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSortingStore } from '../stores/sorting';
  import { useCopyList } from '../composables/useCopyList';

  const sortingStore = useSortingStore();
  const { isCopied, copyButtonTitle, copyList } = useCopyList();

  const items = computed(() => sortingStore.items);
  const currentComparison = computed(() => sortingStore.currentComparison);
  const totalItems = computed(() => sortingStore.items.length);

  function isItemHighlighted(itemId: string): boolean {
    return currentComparison.value?.left.id === itemId || currentComparison.value?.right.id === itemId;
  }

  function handleReset() {
    if (confirm('Start over? All progress will be lost.')) {
      sortingStore.reset();
    }
  }
</script>

<style scoped>
  .list-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 24px 24px;
    border-bottom: 1px solid #d2d2d7;
  }

  .list-title {
    font-size: 22px;
    font-weight: 600;
    color: #1d1d1f;
    letter-spacing: -0.01em;
    margin: 0;
  }

  .header-buttons {
    display: flex;
    gap: 12px;
  }

  .icon-button {
    width: 32px;
    height: 32px;
    background-color: #f5f5f7;
    color: #86868b;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .icon-button:hover {
    background-color: #e8e8ed;
    color: #1d1d1f;
  }

  .list-wrapper {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 64px;
  }

  .items-list {
    display: flex;
    flex-direction: column;
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid #f5f5f7;
    transition:
      all 0.2s ease,
      background-color 0.3s ease,
      border-bottom-color 0.3s ease;
    position: relative;
  }

  .list-item:hover {
    background-color: #f5f5f7;
  }

  .list-item.moving-up {
    background-color: #e8f5e8;
    border-bottom-color: #c3e6c3;
  }

  .list-item.moving-down {
    background-color: #ffeaea;
    border-bottom-color: #f5c6c6;
  }

  .list-item.highlighted {
    background-color: #e8f4fd;
    border-bottom-color: #bdddf6;
  }

  .item-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #f5f5f7;
    color: #86868b;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    margin-right: 16px;
    flex-shrink: 0;
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .list-item.moving-up .item-rank {
    background-color: #34c759;
    color: #ffffff;
  }

  .list-item.moving-down .item-rank {
    background-color: #ff3b30;
    color: #ffffff;
  }

  .list-item.highlighted .item-rank {
    background-color: #007aff;
    color: #ffffff;
  }

  .item-text {
    flex: 1;
    font-size: 17px;
    line-height: 1.4;
    color: #1d1d1f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-item.highlighted .item-text {
    font-weight: 500;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #86868b;
    font-size: 17px;
  }

  /* Transition animations */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.4s ease;
  }

  .list-enter-from {
    opacity: 0;
    transform: translateX(-8px);
  }

  .list-leave-to {
    opacity: 0;
    transform: translateX(8px);
  }

  .list-move {
    transition: transform 0.4s ease;
  }

  /* Clean scrollbar */
  .list-wrapper::-webkit-scrollbar {
    width: 4px;
  }

  .list-wrapper::-webkit-scrollbar-track {
    background: transparent;
  }

  .list-wrapper::-webkit-scrollbar-thumb {
    background: #d2d2d7;
    border-radius: 2px;
  }

  .list-wrapper::-webkit-scrollbar-thumb:hover {
    background: #b0b0b5;
  }
</style>
