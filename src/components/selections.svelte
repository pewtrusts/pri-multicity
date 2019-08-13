<script>
    import { onMount } from 'svelte';
    import viewTypeStore from './../store.js';
    import Loading from './loading.svelte';
    export let dataPromise;
    let typeSelectors
    function changeHandler(e){
        viewTypeStore.set(e.target.value)
    }
    onMount(() => {
        typeSelectors.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', changeHandler);
        });
    });
</script>

<style lang="scss">
    .selections {
        width: 100%;
        height: 40px;
        display: flex;
    }
    .selections > div {
        width: 33%;
        height: 40px;
    }
     .view-type-selectors {
        display: flex;
        justify-content: space-around;
        align-items: center;
        label {
            margin-left: 0.3em;
            position: relative;
            top: .125em;
        }
    } 
</style>

<div class="selections">
{#await dataPromise}
    <div>
        <Loading />
    </div>        
    <div>
        <Loading />
    </div>        
    <div>
        <Loading />
    </div>        
{:then value}
    <div></div>  <!-- different selection types go here -->      
    <div></div>        
    <div bind:this="{typeSelectors}" class="view-type-selectors">
        <div><input type="radio" name="view-type" value="time" id="radio1" checked="true" /><label for="radio1">Over time</label></div>
        <div><input type="radio" name="view-type" value="disaggregated" id="radio2" /><label for="radio2">By age and race</label></div>
    </div>        
{:catch error}
    <p>Oops. Something went wrong</p>
    <code>{error.message}</code>
{/await}
</div>
