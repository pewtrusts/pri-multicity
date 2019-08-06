<script>

    import Button from './button.svelte';
    //import { afterUpdate } from 'svelte';

    let key;
    let value;
    let data = dataPromise;

</script>

<style>
	h1 {
		color: green;
	}
</style>

<div class="hello">
{#await data}
    <p>Please wait. Data is loading</p>
{:then value}
    <h1>Hello {name}! This is a Svelte app</h1>
    <p>{JSON.stringy(value)}</p>
    <Button />
{:catch error}
    <p>Oops. Something went wrong:</p>
    <code>{error.message}</code>}
{/await}
</div>
