

# 2025-09-20

## 💎 [ShellSorting] Move pair comparisons to front on mobiles

Please make it so that on mobile devices the pair comparisons goes first (above the list of items)

## 📄 [Project] Update README

Can you please explain the project briefly in @README.md ? Based on @src\stores\sorting.ts @src\App.vue @src\components\ComparisonComponent.vue @package.json @CLAUDE.md and maybe lines I have selected

## 🐛 [ShellSorting] Fix Shell sort algorithm to properly bubble items to correct positions

I'm afraid our current implementation of shell sorting algorithm is a bit flawed. It only approximates full sorting. Now it has just a fixed number of rounds based on number of items and each round does only single pass. For example n/2, n/4, n/8. But I think that if on some comparison an item moves higher, the algorithm should keep comparing him with higher items, until higher item wins a comparison. Not sure if I describe this in a best way possible, but I believe you understand my intention. When given randomly sorted numbers from 1 to 15, user needs to be able to sort them correctly. In current implementation they are approximately right, but not 100% (e.g. 3, 1, 4, 6, 5, 2, 7, 9, 8, 11, 12, 10, 13, 14, 15). Please think harder about this problem. Then fix the sorting process and also make sure the `estimatedTotalComparisons` is calculated accordingly.

...

One minor thing to polish... the `estimatedTotalComparisons` tends to jump quite abruptly. E.g. from 30 to 50 after ranking single item to go higher. Can something be done about this? One idea I have is to keep list of previous estimates and return an average of the numbers. But that's just some first plan idea, maybe you cant think out something better.

---

# 2025-09-19

## ✨ [ShellSorting] Improve comparison estimates

How does `estimatedTotalComparisons` work in @src\stores\sorting.ts? When sorting 10 items, it estimates 33 comparisons. If I always select the right one, I end up with 20 comparisons in total. If I always select the left one, I end up with 22 comparisons. Is there a better way to compute the estimate? Also, is there a way to make the estimate refine itself as sorting progresses? For example, when I'm finishing the last round and there is a large difference between the actual number of comparisons made and the estimated total, it doesn't add up. Please think harder about this.

...

I think that after sorting is complete the estimated number resets to original estimate.

...

Based on the sorting logic, can you confirm that user is never asked to compare same pair twice (regardless of which item is on the left and which on the right)? If that is the case, is the totalComparisons incrementing, and are the items from pair reorganized in list with transition animations (if order is changing)? Both should be true. Think about this.


## ✨ [ShellSorting] Add copy button on finished state

Let's please also add a simple Copy button next to the Start Over button in the left sidebar. The button should copy the list of items to clipboard. Single item per line. Use an icon instead of text in button.

Also make it that after list is coppied, icon change from clipboard to check icon. But only until the order in list is changed.

Please also let's add copy button from @src\components\ListComponent.vue to @src\components\StatsComponent.vue (with text instead of icon). If there is a lot of code that would need to be coppied, move it to separate reusable file. If you would do this change, consider how to best unify the usage with Start Over button. Implementation should be simple, readable, minimal, elegant.

Buttons should be next to each other not one under another.


## ✨ [ShellSorting] Implement core functionality of shell sorting

Let's create a simple usefull app which would allow users to quickly sort a list of items.

- First, the app should take a list of phrases, one phrase (single word or multiple words) per line, via a textfield element.
- After submitting input the app would show users two phrases next to each other and user would need to pick which one to rate higher (by clicking on item or using left or right arrow keys on keyboard).
- This will be used to sort items from best to worst, utilizing a "humanified" shell sorting algorithm – the pairs to compare will be picked in multiple rounds starting from distant ones (N/2) to more closer ones (N/4 ... 1) keeping the order of items from a pair intact or swaping order in case later item is rated higher than former... just as with the original shell sorting algorithm.
- The emphasis should be given of making as few rounds as possible. For example if some pairs were already compared, don't make user to pick the winner again.
- On the left side of the app there should be a list of all phrases how they are currently sorted & each phrase from the pair currently being compared should be shown in bold. As the order of items in list will change, the transition of individual items position should be animated.
- There should also be a few stats visible, for example how many rounds were made, how many pairs were compared, what is the estimated number of rounds needed to sort the list, etc.

Think hard before implementing, plan your steps, then implement.

...

Daamn the design is hideous. What about following the "The visual design should embody Apple's core design principles: simplicity, clarity, and elegance"? It needs to be completely redone.

- First, you are missing CSS resets. There are unintentional margins etc.
- Don't use any gradient backgrounds.
- Don't use any weird layout boxes. Layout needs to be simple. Utilitarian. Minimalistic. Keep simple list of items aligned on the left side of the screen, utilizing 100% of screen height. Use the rest of the screen to minimalistic items comparisons. And maybe under the compared items show some simple stats.
- I can't emphasize enough how horrible and unnecessarily complicated current design is. Allow for generous whitespace allowing elements ample breathing room for clarity and comfort. Every pixel should feel intentional.

...

Well now this is MUCH better. So only some smaller things to itterate:

- When order of items in list is changing (position is transitioning), please make it that item which is moving up briefly shows as green, and item which is moving down briefly shows as red. Also make the transition animation just a bit slower.
- For the stats component, I think we don't actually need Items and Rounds stats. Progress bar is nice and informative enough.
- I don't like the position of Start over button. Make it so that this button only shows after Sorting is complete. In addition let's add a new button with the same functionality to the left side of the screen, next to the Items title (aligned to right), but use an icon here instead of text.

...

Please add simple transition animations when changing colors to green / red at reordering.
Please make it in the list of items that the text is never wrapped but ended with ellipsis


## 🔧 [Project] Scaffold new Vue.js app
