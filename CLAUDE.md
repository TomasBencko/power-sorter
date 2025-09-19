# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple Vue.js web app. It is a hobby project for my own needs, not a production grade application. This doesn't mean I want to compromise on code quality. Clean code is very important to me. I want the app to be easily extensible. Priority should be given on generating clean, readable, and elegant code, adhering to best practices for sustainable, modern web development. However, the app doesn't need to be 100% foolproof from the UX standpoint.

- The app uses pnpm, Vite, TypeScript, Vue.js, Pinia, Vue Router, Vitest.
- Tailwind CSS & Lucide icons might also be considered if there would be a good reason to add those too.
- App will be hosted on Netlify.
- No need for persistent data or user authorization.
- It is a client only app; no dedicated backend will be created for the app.

## Vue.js guidelines

- The app uses Composition API with strict TypeScript conventions (for example no `any` keyword).
- Each Vue file should start with `<template>` block following with a `<script setup lang='ts'>` and `<style scoped>` (if needed).
- In case Pinia will be used, use the setup syntax.

## Universal development principles

- Solid, reliable, sustainable and scalable foundations
- Clean, simple and elegant code, following best practices of modern web development
- Modularized architecture with clean separation of concerns, enabling quick iterations, frequent refactors, and straightforward solution replacements (e.g. in case we would want to swap one auth solution with another in the future)
- Clean code is code that’s easy to change
- Strict TypeScript conventions (e.g. no `any` keyword)
- Avoid unnecessary coupling
- Maintain single source of truth for every information
- Avoid magic values; use clearly visible constants and enums
- No development shortcuts, hacks, or short-term patches!
- Make sure variable names accurately reflects their purpose.
- Please do not remove any empty lines or any console logs when editing the code.
- Avoid overengineering problems; simple elegant solutions should be always prefered.
