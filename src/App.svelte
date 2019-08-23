<script>
    import Overview from './components/overview.svelte';
    import Selections from  './components/selections.svelte';
    import Dataviz from  './components/dataviz.svelte';
    import Legend from './components/legend.svelte';
    import { groupByStore } from './store.js';
    export let data; // {nestedByIndicator, nestedByCity}
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
    .dataviz-wrapper {
        position: relative;
    }
</style>

<Overview />
<Selections {groupedData} {metadata} />
<div class="dataviz-wrapper" class:by-city="{groupBy === 'nestedByCity'}">
    <Dataviz {groupedData} {metadata} {groupBy} />
</div>
<Legend {metadata} maxRadius=15 minRadius=5 />   
