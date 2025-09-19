# CLAUDE

How do I make Claude Code ignore (not read) specific file? Specifically I'm talking about `prompting-history.md`.

I still see "⏵⏵ accept edits on ... ⧉ In prompting-history.md" in Claude Code... is this okay? Try to prove you still see the file by saying what is the 10th word in this file.

---

# Copy button

Let's please also add a simple Copy button next to the Start Over button in the left sidebar. The button should copy the list of items to clipboard. Single item per line. Use an icon instead of text in button.

Also make it that after list is coppied, icon change from clipboard to check icon. But only until the order in list is changed.

---

# Design overhauling

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

---

# Initial prompt

Let's create a simple usefull app which would allow users to quickly sort a list of items.

- First, the app should take a list of phrases, one phrase (single word or multiple words) per line, via a textfield element.
- After submitting input the app would show users two phrases next to each other and user would need to pick which one to rate higher (by clicking on item or using left or right arrow keys on keyboard).
- This will be used to sort items from best to worst, utilizing a "humanified" shell sorting algorithm – the pairs to compare will be picked in multiple rounds starting from distant ones (N/2) to more closer ones (N/4 ... 1) keeping the order of items from a pair intact or swaping order in case later item is rated higher than former... just as with the original shell sorting algorithm.
- The emphasis should be given of making as few rounds as possible. For example if some pairs were already compared, don't make user to pick the winner again.
- On the left side of the app there should be a list of all phrases how they are currently sorted & each phrase from the pair currently being compared should be shown in bold. As the order of items in list will change, the transition of individual items position should be animated.
- There should also be a few stats visible, for example how many rounds were made, how many pairs were compared, what is the estimated number of rounds needed to sort the list, etc.

Think hard before implementing, plan your steps, then implement.
