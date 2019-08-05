<script>

    import Button from './button.svelte';
    //import { afterUpdate } from 'svelte';

	export let name;
    let key;
    let value;
    let data = new Promise((resolve) => {
        setTimeout(() => {
            resolve({key: 'US', value: 'Unites States'});
            status = 'resolved'; // reassigning `status` is what triggers an update. `{#await}` changes in markup do not
        }, 3000);
    });

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
    <p>{value.key}: {value.value}</p>
    <Button />
{:catch error}
    <p>Oops. Something went wrong:</p>
    <code>{error.message}</code>}
{/await}
</div>
