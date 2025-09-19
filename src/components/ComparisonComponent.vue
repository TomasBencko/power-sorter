<template>
  <div class="comparison-container">
    <h2 class="comparison-title">Which should rank higher?</h2>

    <div class="comparison-items">
      <button class="comparison-item" @click="selectLeft" :class="{ selected: selectedSide === 'left' }">
        <span class="item-text">{{ currentComparison.left.text }}</span>
        <span class="selection-hint">←</span>
      </button>

      <button class="comparison-item" @click="selectRight" :class="{ selected: selectedSide === 'right' }">
        <span class="item-text">{{ currentComparison.right.text }}</span>
        <span class="selection-hint">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useSortingStore, type CurrentComparison } from '../stores/sorting';

  interface Props {
    currentComparison: CurrentComparison;
  }

  const props = defineProps<Props>();
  const sortingStore = useSortingStore();

  const selectedSide = ref<'left' | 'right' | null>(null);

  function selectLeft() {
    selectedSide.value = 'left';
    setTimeout(() => {
      sortingStore.makeComparison(props.currentComparison.left.id);
      selectedSide.value = null;
    }, 100);
  }

  function selectRight() {
    selectedSide.value = 'right';
    setTimeout(() => {
      sortingStore.makeComparison(props.currentComparison.right.id);
      selectedSide.value = null;
    }, 100);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectLeft();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectRight();
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
</script>

<style scoped>
  .comparison-container {
    max-width: 800px;
    width: 100%;
  }

  .comparison-title {
    font-size: 28px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 48px;
    text-align: center;
    letter-spacing: -0.01em;
  }

  .comparison-items {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
  }

  .comparison-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background-color: #f5f5f7;
    border: 1px solid transparent;
    border-radius: 18px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }

  .comparison-item:hover {
    background-color: #e8e8ed;
    transform: translateY(-1px);
  }

  .comparison-item.selected {
    background-color: #007aff;
    color: #ffffff;
    transform: scale(0.99);
  }

  .item-text {
    font-size: 19px;
    font-weight: 500;
    text-align: center;
    line-height: 1.3;
  }

  .selection-hint {
    font-size: 24px;
    opacity: 0.5;
    font-weight: 300;
    margin-bottom: -8px;
  }

  .comparison-item.selected .selection-hint {
    opacity: 0.8;
  }

  @media (max-width: 640px) {
    .comparison-items {
      flex-direction: column;
      gap: 16px;
    }

    .comparison-item {
      padding: 36px 24px;
      min-height: 120px;
    }

    .item-text {
      font-size: 17px;
    }
  }
</style>
