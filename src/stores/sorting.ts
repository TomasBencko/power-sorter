import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

interface SortItem {
  id: string;
  text: string;
  originalIndex: number;
  animationDirection?: 'up' | 'down';
}

interface Comparison {
  leftId: string;
  rightId: string;
  winnerId: string;
}

export interface CurrentComparison {
  left: SortItem;
  right: SortItem;
  leftIndex: number;
  rightIndex: number;
}

export const useSortingStore = defineStore('sorting', () => {
  // Core state
  const items = ref<SortItem[]>([]);
  const comparisons = ref<Comparison[]>([]);
  const currentGap = ref<number>(0);
  const currentLeftIndex = ref<number>(0);
  const currentRightIndex = ref<number>(0);
  const isFinished = ref<boolean>(false);
  const roundsCompleted = ref<number>(0);

  // Phase management
  const phase = ref<'input' | 'sorting' | 'complete'>('input');

  // Computed properties
  const totalComparisons = computed(() => comparisons.value.length);

  const estimatedTotalComparisons = computed(() => {
    if (items.value.length <= 1) return 0;

    const n = items.value.length;
    const gaps = getShellSortGaps(n);

    // If sorting hasn't started, return static estimate
    if (phase.value === 'input') {
      return gaps.reduce((total, gap) => total + Math.max(0, n - gap), 0);
    }

    // If sorting is complete, return actual comparisons made
    if (phase.value === 'complete') {
      return comparisons.value.length;
    }

    // Dynamic estimate: comparisons made + remaining comparisons
    const madeComparisons = comparisons.value.length;
    const currentGapIndex = gaps.indexOf(currentGap.value);

    if (currentGapIndex === -1) return madeComparisons;

    let remainingComparisons = 0;

    // Remaining comparisons for current gap
    const totalForCurrentGap = Math.max(0, n - currentGap.value);
    const progressInCurrentGap = Math.max(0, currentLeftIndex.value);
    remainingComparisons += Math.max(0, totalForCurrentGap - progressInCurrentGap);

    // Comparisons for future gaps
    for (let i = currentGapIndex + 1; i < gaps.length; i++) {
      const gap = gaps[i];
      remainingComparisons += Math.max(0, n - gap);
    }

    return madeComparisons + remainingComparisons;
  });

  const progress = computed(() => {
    if (estimatedTotalComparisons.value === 0) return 0;
    return Math.min(100, (totalComparisons.value / estimatedTotalComparisons.value) * 100);
  });

  const currentComparison = computed((): CurrentComparison | null => {
    if (phase.value !== 'sorting' || isFinished.value) return null;

    const leftItem = items.value[currentLeftIndex.value];
    const rightItem = items.value[currentRightIndex.value];

    if (!leftItem || !rightItem) return null;

    return {
      left: leftItem,
      right: rightItem,
      leftIndex: currentLeftIndex.value,
      rightIndex: currentRightIndex.value,
    };
  });

  // Helper functions
  function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  function hasComparison(leftId: string, rightId: string): Comparison | null {
    return (
      comparisons.value.find(
        comp =>
          (comp.leftId === leftId && comp.rightId === rightId) || (comp.leftId === rightId && comp.rightId === leftId),
      ) || null
    );
  }

  function getShellSortGaps(n: number): number[] {
    const gaps: number[] = [];
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      gaps.push(gap);
      gap = Math.floor(gap / 2);
    }
    return gaps;
  }

  // Main functions
  function initializeItems(inputText: string): void {
    const lines = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    items.value = lines.map((text, index) => ({
      id: generateId(),
      text,
      originalIndex: index,
    }));

    comparisons.value = [];
    currentGap.value = 0;
    currentLeftIndex.value = 0;
    currentRightIndex.value = 0;
    isFinished.value = false;
    roundsCompleted.value = 0;

    if (items.value.length <= 1) {
      phase.value = 'complete';
      isFinished.value = true;
    } else {
      phase.value = 'sorting';
      startSorting();
    }
  }

  function startSorting(): void {
    const gaps = getShellSortGaps(items.value.length);
    if (gaps.length === 0) {
      finishSorting();
      return;
    }

    currentGap.value = gaps[0];
    currentLeftIndex.value = 0;
    currentRightIndex.value = currentGap.value;

    findNextComparison();
  }

  function findNextComparison(): void {
    const gaps = getShellSortGaps(items.value.length);
    let gapIndex = gaps.indexOf(currentGap.value);

    while (gapIndex < gaps.length) {
      const gap = gaps[gapIndex];

      for (let i = currentLeftIndex.value; i < items.value.length - gap; i++) {
        const leftItem = items.value[i];
        const rightItem = items.value[i + gap];

        const existingComparison = hasComparison(leftItem.id, rightItem.id);

        if (!existingComparison) {
          currentGap.value = gap;
          currentLeftIndex.value = i;
          currentRightIndex.value = i + gap;
          return;
        } else {
          // Use existing comparison result
          if (existingComparison.winnerId === rightItem.id) {
            // Right item wins, swap them
            swapItems(i, i + gap);
          }
        }
      }

      // Move to next gap
      gapIndex++;
      if (gapIndex < gaps.length) {
        roundsCompleted.value++;
        currentLeftIndex.value = 0;
      }
    }

    finishSorting();
  }

  function swapItems(index1: number, index2: number): void {
    // Mark items for direction animation
    const item1 = items.value[index1];
    const item2 = items.value[index2];

    // Add temporary animation flags
    item1.animationDirection = index1 < index2 ? 'down' : 'up';
    item2.animationDirection = index1 < index2 ? 'up' : 'down';

    // Perform swap
    const temp = items.value[index1];
    items.value[index1] = items.value[index2];
    items.value[index2] = temp;

    // Clear animation flags after animation completes
    setTimeout(() => {
      if (item1) delete item1.animationDirection;
      if (item2) delete item2.animationDirection;
    }, 600);
  }

  function makeComparison(winnerId: string): void {
    const comparison = currentComparison.value;
    if (!comparison) return;

    // Record the comparison
    comparisons.value.push({
      leftId: comparison.left.id,
      rightId: comparison.right.id,
      winnerId,
    });

    // If right item wins, swap them
    if (winnerId === comparison.right.id) {
      swapItems(comparison.leftIndex, comparison.rightIndex);
    }

    // Move to next comparison within current gap
    currentLeftIndex.value++;
    currentRightIndex.value = currentLeftIndex.value + currentGap.value;

    // Find next comparison or move to next gap
    findNextComparison();
  }

  function finishSorting(): void {
    isFinished.value = true;
    phase.value = 'complete';
  }

  function reset(): void {
    items.value = [];
    comparisons.value = [];
    currentGap.value = 0;
    currentLeftIndex.value = 0;
    currentRightIndex.value = 0;
    isFinished.value = false;
    roundsCompleted.value = 0;
    phase.value = 'input';
  }

  return {
    // State
    items,
    comparisons,
    phase,
    isFinished,
    roundsCompleted,

    // Computed
    totalComparisons,
    estimatedTotalComparisons,
    progress,
    currentComparison,

    // Actions
    initializeItems,
    makeComparison,
    reset,
  };
});
