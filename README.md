# Power Sorter

A Vue.js web application that allows users to efficiently sort lists of items using human judgment and a shell sorting algorithm.

## What It Does

Power Sorter takes a list of text items (phrases, words, ideas, etc.) and helps you sort them from best to worst through strategic pairwise comparisons. Instead of requiring you to compare every item with every other item, it uses an optimized shell sorting approach that minimizes the number of comparisons needed.

### How It Works

1. **Input Phase**: Enter your list of items, one per line
2. **Sorting Phase**: The app presents pairs of items for you to compare, asking "Which should rank higher?"
3. **Smart Algorithm**: Uses shell sorting gaps (N/2, N/4, ..., 1) to minimize total comparisons
4. **Visual Feedback**: See your list update in real-time with smooth animations as items move
5. **Progress Tracking**: Monitor sorting progress with statistics and estimates

### Key Features

- **Efficient Sorting**: Shell sorting algorithm reduces comparison overhead
- **Keyboard Navigation**: Use arrow keys (← →) for quick comparisons
- **Live Updates**: Watch your list reorganize with smooth animations
- **Progress Stats**: Track comparisons made, rounds completed, and estimated remaining work
- **Responsive Design**: Works on desktop and mobile devices
- **Apple-Inspired UI**: Clean, elegant interface following Apple design principles

## Technical Stack

- **Vue 3** with Composition API and TypeScript
- **Pinia** for state management
- **Vite** for development and building
- **Vitest** for testing
- **ESLint + Prettier** for code quality

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
