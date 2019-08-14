<script lang>
    import { onMount } from 'svelte';
    import viewTypeStore from './../store.js';
    import Loading from './loading.svelte';
    import Dropdown from './dropdown.svelte';
    import dictionary from './../data/dictionary.json';
    export let dataPromise;

    export let typeSelectors;
    
     function createOptions(values){
        return values.map((value, i) => {
            return {
                value: value.key,
                display: dictionary[value.key].label,
                isInitialSelected: i === 0
            };
        });
    }


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
        display: flex;
        position: sticky;
        top: 100px;
        padding: 10px 0;
        background-color: #fff;
        z-index: 2;
    }
    .selections > div {
        width: 33%;
        
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
{:then values}
    <div>
        <Dropdown label="Indicator:" options="{createOptions(values)}" />
    </div>  <!-- different selection types go here -->      
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
