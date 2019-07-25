/* global process */
import App from './App.svelte';

const app = new App({
	target: document.querySelector('#svelte-container'),
	props: {
		name: 'world'
	},
    hydrate: true
});

window.app = app;

export default app;