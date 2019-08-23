import { writable } from 'svelte/store';

const viewTypeStore = writable('time');
const groupBy = writable('nestedByCity');
const inViewSection = writable('');
const scrolledToSection = writable('');

export { viewTypeStore, inViewSection as inViewSectionStore, scrolledToSection as scrolledToStore, groupBy as groupByStore };