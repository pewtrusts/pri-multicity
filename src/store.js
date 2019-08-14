import { writable } from 'svelte/store';

const viewTypeStore = writable('time');
const inViewSection = writable('');

export { viewTypeStore, inViewSection as inViewSectionStore  };