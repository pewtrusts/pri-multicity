<script>
    import Overview from './components/overview.svelte';
    import Selections from  './components/selections.svelte';
    import Dataviz from  './components/dataviz.svelte';
    import { groupByStore } from './store.js';
    export let data; // {nestedByIndicator, nestedByCity}
    export let initialCities;
    export let initialIndicator;
    export let metadata;

    let groupedData;
    let groupBy;

    groupByStore.subscribe(value => {
        groupedData = data[value];
        groupBy = value;
    });

    
    
</script>

<style>
    :global(.wire), :global(.wire) * {
        outline: 1px solid magenta;
    }   
</style>

<Overview />
<Selections {groupedData} {metadata} />
<div class:by-city="{groupBy === 'nestedByCity'}">
    <Dataviz {groupedData} {initialCities} {metadata} {groupBy} />
</div>
