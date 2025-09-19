import { ref, computed, watch } from 'vue';
import { useSortingStore } from '../stores/sorting';

export function useCopyList() {
  const sortingStore = useSortingStore();

  const isCopied = ref(false);
  const lastCopiedOrder = ref<string[]>([]);
  const copyButtonTitle = ref('Copy list to clipboard');

  const items = computed(() => sortingStore.items);

  async function copyList() {
    try {
      const itemsText = items.value.map(item => item.text).join('\n');
      await navigator.clipboard.writeText(itemsText);

      // Set copied state
      isCopied.value = true;
      lastCopiedOrder.value = items.value.map(item => item.text);
      copyButtonTitle.value = 'Copied!';

      setTimeout(() => {
        if (isCopied.value) {
          copyButtonTitle.value = 'List copied to clipboard';
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      copyButtonTitle.value = 'Copy failed';
      setTimeout(() => {
        copyButtonTitle.value = 'Copy list to clipboard';
      }, 2000);
    }
  }

  // Watch for changes in list order and reset copied state
  watch(
    () => items.value.map(item => item.text),
    newOrder => {
      if (isCopied.value && lastCopiedOrder.value.length > 0) {
        // Check if order has changed
        const orderChanged =
          newOrder.length !== lastCopiedOrder.value.length ||
          newOrder.some((text, index) => text !== lastCopiedOrder.value[index]);

        if (orderChanged) {
          isCopied.value = false;
          copyButtonTitle.value = 'Copy list to clipboard';
          lastCopiedOrder.value = [];
        }
      }
    },
    { deep: true },
  );

  return {
    isCopied,
    copyButtonTitle,
    copyList,
  };
}
