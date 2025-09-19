<template>
  <div class="stats-container">
    <div class="progress-section">
      <div class="progress-label">{{ totalComparisons }} / {{ estimatedTotalComparisons }} comparisons</div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <p class="instruction-text">Click or use arrow keys</p>

    <div v-if="totalItems > 0 && isFinished" class="action-buttons">
      <button @click="copyList" class="copy-button" :title="copyButtonTitle">
        {{ isCopied ? 'Copied!' : 'Copy List' }}
      </button>
      <button @click="handleReset" class="reset-button">Start Over</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSortingStore } from '../stores/sorting';
  import { useCopyList } from '../composables/useCopyList';

  const sortingStore = useSortingStore();
  const { isCopied, copyButtonTitle, copyList } = useCopyList();

  const totalItems = computed(() => sortingStore.items.length);
  const totalComparisons = computed(() => sortingStore.totalComparisons);
  const estimatedTotalComparisons = computed(() => sortingStore.estimatedTotalComparisons);
  const progress = computed(() => sortingStore.progress);
  const isFinished = computed(() => sortingStore.isFinished);

  function handleReset() {
    if (confirm('Start over? All progress will be lost.')) {
      sortingStore.reset();
    }
  }
</script>

<style scoped>
  .stats-container {
    max-width: 320px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .progress-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .progress-label {
    font-size: 15px;
    color: #86868b;
    text-align: center;
  }

  .progress-bar {
    height: 4px;
    background-color: #f5f5f7;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #007aff;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .instruction-text {
    font-size: 15px;
    color: #86868b;
    text-align: center;
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    justify-content: center;
  }

  .copy-button,
  .reset-button {
    padding: 12px 24px;
    background-color: #f5f5f7;
    color: #1d1d1f;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    transition: background-color 0.2s ease;
    min-width: 120px;
  }

  .copy-button:hover,
  .reset-button:hover {
    background-color: #e8e8ed;
  }
</style>
