import { writable } from 'svelte/store';

const viewTypeStore = writable('timexx');
const groupBy = writable('nestedByIndicator');
const inViewSection = writable('');
const scrolledToSection = writable('');

export { viewTypeStore, inViewSection as inViewSectionStore, scrolledToSection as scrolledToStore, groupBy as groupByStore };