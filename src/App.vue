<template>
  <div class="app">
    <!-- Input Phase -->
    <div v-if="phase === 'input'" class="input-phase">
      <InputComponent />
    </div>

    <!-- Sorting Phase -->
    <div v-else-if="phase === 'sorting'" class="sorting-phase">
      <div class="sidebar">
        <ListComponent />
      </div>

      <div class="main-area">
        <ComparisonComponent v-if="currentComparison" :current-comparison="currentComparison" />
        <StatsComponent />
      </div>
    </div>

    <!-- Complete Phase -->
    <div v-else-if="phase === 'complete'" class="complete-phase">
      <div class="sidebar">
        <ListComponent />
      </div>

      <div class="main-area">
        <div class="completion-content">
          <h1 class="completion-title">Sorting Complete</h1>
          <StatsComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSortingStore } from './stores/sorting';
  import InputComponent from './components/InputComponent.vue';
  import ComparisonComponent from './components/ComparisonComponent.vue';
  import ListComponent from './components/ListComponent.vue';
  import StatsComponent from './components/StatsComponent.vue';

  const sortingStore = useSortingStore();

  const phase = computed(() => sortingStore.phase);
  const currentComparison = computed(() => sortingStore.currentComparison);
</script>

<style scoped>
  .app {
    min-height: 100vh;
    background-color: #ffffff;
  }

  .input-phase {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px;
  }

  .sorting-phase,
  .complete-phase {
    min-height: 100vh;
    display: flex;
  }

  .sidebar {
    width: 380px;
    height: 100vh;
    border-right: 1px solid #d2d2d7;
    flex-shrink: 0;
  }

  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px;
    gap: 64px;
  }

  .completion-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .completion-title {
    font-size: 48px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 32px;
    letter-spacing: -0.02em;
  }

  @media (max-width: 768px) {
    .sorting-phase,
    .complete-phase {
      flex-direction: column;
    }

    .sorting-phase .main-area {
      order: -1;
    }

    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid #d2d2d7;
    }

    .main-area {
      padding: 32px;
      gap: 32px;
    }

    .completion-title {
      font-size: 32px;
    }
  }
</style>
