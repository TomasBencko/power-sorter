import { describe, it, expect } from 'vitest';
import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import App from '../App.vue';

describe('App', () => {
  it('mounts renders properly', () => {
    const pinia = createPinia();
    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // App should start in input phase
    expect(wrapper.html()).toContain('input-phase');
  });
});
