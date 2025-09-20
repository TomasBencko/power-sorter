import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSortingStore } from '../stores/sorting';

describe('Sorting Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('correctly sorts a list of items using Shell sort', () => {
    const store = useSortingStore();

    // Initialize with the user's example: numbers 1-15 in random order
    const inputText = '9\n1\n15\n13\n4\n6\n3\n10\n7\n8\n5\n2\n14\n12\n11';
    store.initializeItems(inputText);

    expect(store.phase).toBe('sorting');
    expect(store.items.length).toBe(15);

    // Simulate sorting by making all necessary comparisons
    // In a real Shell sort, we'd make comparisons based on numeric value
    let iterations = 0;
    const maxIterations = 200; // Safety limit

    while (store.currentComparison && !store.isFinished && iterations < maxIterations) {
      const comparison = store.currentComparison;

      // Compare based on the numeric value of the text
      const leftValue = parseInt(comparison.left.text);
      const rightValue = parseInt(comparison.right.text);

      // Winner is the smaller number (for ascending sort)
      const winnerId = leftValue < rightValue ? comparison.left.id : comparison.right.id;

      store.makeComparison(winnerId);
      iterations++;
    }

    expect(store.isFinished).toBe(true);
    expect(store.phase).toBe('complete');

    // Verify the items are sorted correctly
    const sortedTexts = store.items.map(item => item.text);
    const expectedOrder = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

    expect(sortedTexts).toEqual(expectedOrder);
  });

  it('handles a simple case correctly', () => {
    const store = useSortingStore();

    // Test with a simple 3-item list
    const inputText = '3\n1\n2';
    store.initializeItems(inputText);

    let iterations = 0;
    const maxIterations = 10;

    while (store.currentComparison && !store.isFinished && iterations < maxIterations) {
      const comparison = store.currentComparison;

      const leftValue = parseInt(comparison.left.text);
      const rightValue = parseInt(comparison.right.text);

      const winnerId = leftValue < rightValue ? comparison.left.id : comparison.right.id;

      store.makeComparison(winnerId);
      iterations++;
    }

    expect(store.isFinished).toBe(true);

    const sortedTexts = store.items.map(item => item.text);
    expect(sortedTexts).toEqual(['1', '2', '3']);
  });

  it('handles single item correctly', () => {
    const store = useSortingStore();

    const inputText = '42';
    store.initializeItems(inputText);

    expect(store.isFinished).toBe(true);
    expect(store.phase).toBe('complete');
    expect(store.items.map(item => item.text)).toEqual(['42']);
  });

  it('handles empty input correctly', () => {
    const store = useSortingStore();

    const inputText = '';
    store.initializeItems(inputText);

    expect(store.items.length).toBe(0);
    expect(store.phase).toBe('complete');
  });
});
