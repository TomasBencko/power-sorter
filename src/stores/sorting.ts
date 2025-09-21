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
  const currentInsertionIndex = ref<number>(0); // Which element we're currently positioning
  const currentComparisonIndex = ref<number>(0); // Where in the backward comparison sequence we are
  const smoothedEstimate = ref<number>(0); // Smoothed estimate to prevent abrupt jumps

  // Timing state
  const sortingStartTime = ref<number | null>(null);
  const sortingEndTime = ref<number | null>(null);
  const lastComparisonTime = ref<number>(0);
  const comparisonsTimeHistory = ref<number[]>([]);
  const currentTime = ref<number>(Date.now());

  // Update current time every second to make elapsed time reactive
  let timeInterval: number | null = null;

  // Phase management
  const phase = ref<'input' | 'sorting' | 'complete'>('input');

  // Computed properties
  const totalComparisons = computed(() => comparisons.value.length);

  const estimatedTotalComparisons = computed(() => {
    if (items.value.length <= 1) return 0;

    const n = items.value.length;
    const gaps = getShellSortGaps(n);

    // If sorting hasn't started, return static estimate and initialize smoothed value
    if (phase.value === 'input') {
      const estimate = gaps.reduce((total, gap) => {
        const elementsToSort = Math.max(0, n - gap);
        const avgComparisonsPerElement = Math.max(1, Math.log2(gap));
        return total + elementsToSort * avgComparisonsPerElement;
      }, 0);
      smoothedEstimate.value = estimate;
      return estimate;
    }

    // If sorting is complete, return actual comparisons made
    if (phase.value === 'complete') {
      return comparisons.value.length;
    }

    // Calculate raw estimate
    const madeComparisons = comparisons.value.length;
    const currentGapIndex = gaps.indexOf(currentGap.value);

    if (currentGapIndex === -1) return madeComparisons;

    // Calculate progress within current gap
    const elementsInCurrentGap = Math.max(0, n - currentGap.value);
    const elementsCompleted = Math.max(0, currentInsertionIndex.value - currentGap.value);

    // Use a more conservative efficiency estimate to reduce volatility
    const totalElementsProcessed = roundsCompleted.value * n + elementsCompleted;
    const baseEfficiency = 1.5; // Conservative base
    const actualEfficiency = totalElementsProcessed > 0 ? madeComparisons / totalElementsProcessed : baseEfficiency;
    const comparisonsPerElement = Math.max(baseEfficiency, Math.min(actualEfficiency, baseEfficiency * 2));

    let remainingComparisons = 0;

    // Remaining comparisons for current gap
    const remainingElementsInGap = Math.max(0, elementsInCurrentGap - elementsCompleted);
    remainingComparisons += remainingElementsInGap * comparisonsPerElement;

    // Comparisons for future gaps (use conservative estimate)
    for (let i = currentGapIndex + 1; i < gaps.length; i++) {
      const gap = gaps[i];
      const elementsToSort = Math.max(0, n - gap);
      const avgComparisonsPerElement = Math.max(1, Math.log2(gap) * 0.8); // Slightly more conservative
      remainingComparisons += elementsToSort * avgComparisonsPerElement;
    }

    const rawEstimate = madeComparisons + remainingComparisons;

    // Apply smoothing to prevent abrupt changes
    const smoothingFactor = 0.3; // How quickly to adapt (0.1 = very smooth, 0.5 = more responsive)
    const maxChangePercent = 0.15; // Maximum 15% change per update

    if (smoothedEstimate.value === 0) {
      smoothedEstimate.value = rawEstimate;
    } else {
      // Calculate the maximum allowed change
      const maxChange = smoothedEstimate.value * maxChangePercent;
      const proposedChange = rawEstimate - smoothedEstimate.value;

      // Cap the change to prevent jumps
      const cappedChange = Math.sign(proposedChange) * Math.min(Math.abs(proposedChange), maxChange);
      const targetEstimate = smoothedEstimate.value + cappedChange;

      // Apply exponential smoothing
      smoothedEstimate.value = smoothedEstimate.value + smoothingFactor * (targetEstimate - smoothedEstimate.value);
    }

    return Math.round(smoothedEstimate.value);
  });

  const progress = computed(() => {
    if (estimatedTotalComparisons.value === 0) return 0;
    return Math.min(100, (totalComparisons.value / estimatedTotalComparisons.value) * 100);
  });

  const elapsedTime = computed(() => {
    if (!sortingStartTime.value) return 0;
    const endTime = sortingEndTime.value || currentTime.value;
    return Math.floor((endTime - sortingStartTime.value) / 1000);
  });

  const estimatedTimeRemaining = computed(() => {
    if (phase.value !== 'sorting' || !sortingStartTime.value || totalComparisons.value === 0) return null;

    // Use recent comparisons to estimate time per comparison
    const recentComparisons = Math.min(10, comparisonsTimeHistory.value.length);
    if (recentComparisons < 3) return null;

    const recentTimes = comparisonsTimeHistory.value.slice(-recentComparisons);
    const avgTimePerComparison = recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length;

    const remainingComparisons = Math.max(0, estimatedTotalComparisons.value - totalComparisons.value);
    const estimatedSeconds = Math.floor((remainingComparisons * avgTimePerComparison) / 1000);

    return estimatedSeconds;
  });

  const currentComparison = computed((): CurrentComparison | null => {
    if (phase.value !== 'sorting' || isFinished.value) return null;

    const leftItem = items.value[currentComparisonIndex.value];
    const rightItem = items.value[currentInsertionIndex.value];

    if (!leftItem || !rightItem) return null;

    return {
      left: leftItem,
      right: rightItem,
      leftIndex: currentComparisonIndex.value,
      rightIndex: currentInsertionIndex.value,
    };
  });

  // Helper functions
  function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  function startTimer(): void {
    if (timeInterval) clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      currentTime.value = Date.now();
    }, 1000);
  }

  function stopTimer(): void {
    if (timeInterval) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
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
    currentInsertionIndex.value = 0;
    currentComparisonIndex.value = 0;
    smoothedEstimate.value = 0;
    isFinished.value = false;
    roundsCompleted.value = 0;

    if (items.value.length <= 1) {
      phase.value = 'complete';
      isFinished.value = true;
    } else {
      phase.value = 'sorting';
      // Start timing when we enter sorting phase
      const now = Date.now();
      sortingStartTime.value = now;
      lastComparisonTime.value = now;
      currentTime.value = now;
      startTimer();
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
    currentInsertionIndex.value = currentGap.value; // Start with first element that needs positioning
    currentComparisonIndex.value = 0; // Will be set in findNextComparison

    findNextComparison();
  }

  function findNextComparison(): void {
    const gaps = getShellSortGaps(items.value.length);
    let gapIndex = gaps.indexOf(currentGap.value);

    while (gapIndex < gaps.length) {
      const gap = gaps[gapIndex];

      // Continue with current element if we're in the middle of positioning it
      while (currentInsertionIndex.value < items.value.length) {
        const elementToPosition = items.value[currentInsertionIndex.value];

        // Find where to compare this element backward in the gap sequence
        let compareIndex = currentInsertionIndex.value - gap;

        // Find the next comparison position for this element
        while (compareIndex >= 0) {
          const compareItem = items.value[compareIndex];
          const existingComparison = hasComparison(compareItem.id, elementToPosition.id);

          if (!existingComparison) {
            // We found a comparison we need to make
            currentComparisonIndex.value = compareIndex;
            return;
          } else {
            // Use existing comparison result
            if (existingComparison.winnerId === elementToPosition.id) {
              // Element we're positioning wins, so it should move further back
              swapItems(compareIndex, currentInsertionIndex.value);
              // Update currentInsertionIndex since the element moved
              currentInsertionIndex.value = compareIndex;
            } else {
              // Element we're positioning loses, so it has found its position
              break;
            }
          }

          compareIndex -= gap;
        }

        // This element is now in its correct position for this gap
        // Move to next element
        currentInsertionIndex.value++;
      }

      // All elements for this gap are positioned, move to next gap
      gapIndex++;
      if (gapIndex < gaps.length) {
        roundsCompleted.value++;
        currentGap.value = gaps[gapIndex];
        currentInsertionIndex.value = currentGap.value; // Start with first element that needs positioning
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

    // Initialize timing if we're in a session that started before timing was added
    if (!sortingStartTime.value && phase.value === 'sorting') {
      const estimatedStartTime = Date.now() - (comparisons.value.length * 3000);
      sortingStartTime.value = estimatedStartTime;
      lastComparisonTime.value = Date.now() - 3000;
      currentTime.value = Date.now();
      startTimer();
    }

    // Track timing for this comparison
    const now = Date.now();
    const timeSinceLastComparison = now - lastComparisonTime.value;
    comparisonsTimeHistory.value.push(timeSinceLastComparison);

    // Keep only recent history (last 20 comparisons)
    if (comparisonsTimeHistory.value.length > 20) {
      comparisonsTimeHistory.value.shift();
    }

    lastComparisonTime.value = now;

    // Record the comparison
    comparisons.value.push({
      leftId: comparison.left.id,
      rightId: comparison.right.id,
      winnerId,
    });

    // If the element we're positioning (right item) wins, swap them
    if (winnerId === comparison.right.id) {
      swapItems(comparison.leftIndex, comparison.rightIndex);
      // Update currentInsertionIndex since the element moved
      currentInsertionIndex.value = comparison.leftIndex;
    }

    // Find next comparison
    findNextComparison();
  }

  function finishSorting(): void {
    // Record end time
    sortingEndTime.value = Date.now();
    stopTimer();
    isFinished.value = true;
    phase.value = 'complete';
  }

  function reset(): void {
    stopTimer();
    items.value = [];
    comparisons.value = [];
    currentGap.value = 0;
    currentLeftIndex.value = 0;
    currentRightIndex.value = 0;
    currentInsertionIndex.value = 0;
    currentComparisonIndex.value = 0;
    smoothedEstimate.value = 0;
    isFinished.value = false;
    roundsCompleted.value = 0;
    phase.value = 'input';

    // Reset timing state
    sortingStartTime.value = null;
    sortingEndTime.value = null;
    lastComparisonTime.value = 0;
    comparisonsTimeHistory.value = [];
    currentTime.value = Date.now();
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
    elapsedTime,
    estimatedTimeRemaining,

    // Actions
    initializeItems,
    makeComparison,
    reset,
  };
});
