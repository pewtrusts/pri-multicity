<script>
    import dictionary from './../data/dictionary.json';
    import DatavizWaiting from './dataviz_waiting.svelte';
    import DatavizResolved from './dataviz_resolved.svelte';
    export let initialCities;
    export let initialIndicator;
    export let dataPromise;
    export let metadata

</script>

<style lang="scss">
    .dataviz-container {
        display: flex;
        flex-wrap: wrap;
    }
</style>

<h2>{dictionary[initialIndicator]}</h2>
<div class="dataviz-container">
{#await dataPromise}
    <DatavizWaiting {initialCities} />
{:then data}
    <DatavizResolved {initialIndicator} {data} {metadata} />
{/await}    
</div>


