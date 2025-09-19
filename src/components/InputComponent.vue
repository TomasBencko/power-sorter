<template>
  <div class="input-container">
    <h1 class="title">Power Sorter</h1>
    <p class="subtitle">Enter items to sort, one per line</p>

    <form @submit.prevent="handleSubmit" class="input-form">
      <textarea
        v-model="inputText"
        placeholder="Enter your items here..."
        class="input-textarea"
        rows="12"
        :disabled="isSubmitting"
      />

      <button type="submit" class="submit-button" :disabled="!canSubmit || isSubmitting">
        {{ isSubmitting ? 'Starting...' : 'Start Sorting' }}
      </button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSortingStore } from '../stores/sorting';

const sortingStore = useSortingStore();

const inputText = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

const canSubmit = computed(() => {
  const lines = inputText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  return lines.length >= 2;
});

async function handleSubmit() {
  if (!canSubmit.value) {
    errorMessage.value = 'Please enter at least 2 items to sort.';
    return;
  }

  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    sortingStore.initializeItems(inputText.value);
  } catch (error) {
    errorMessage.value = 'An error occurred while processing your input.';
    console.error('Error initializing items:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.input-container {
  max-width: 480px;
  width: 100%;
}

.title {
  font-size: 48px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 21px;
  color: #86868b;
  margin-bottom: 48px;
  font-weight: 400;
  line-height: 1.3;
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-size: 17px;
  line-height: 1.4;
  resize: vertical;
  min-height: 240px;
  background-color: #ffffff;
  transition: border-color 0.2s ease;
}

.input-textarea:focus {
  border-color: #007aff;
}

.input-textarea:disabled {
  background-color: #f5f5f7;
  color: #86868b;
  cursor: not-allowed;
}

.input-textarea::placeholder {
  color: #86868b;
}

.submit-button {
  padding: 16px 24px;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #0051d0;
}

.submit-button:disabled {
  background-color: #d2d2d7;
  color: #86868b;
  cursor: not-allowed;
}

.error-message {
  color: #ff3b30;
  font-size: 15px;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 19px;
  }
}
</style>
