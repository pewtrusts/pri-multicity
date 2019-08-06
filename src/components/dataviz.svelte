<script>
    import dictionary from './../data/dictionary.json';
    import DatavizLoading from './dataviz_loading.svelte';
    export let initialCities;
    export let initialIndicator;
    export let dataPromise;

</script>

<style lang="scss">
    .dataviz-container {
        display: flex;
        flex-wrap: wrap;
    }
</style>

<h2>{dictionary[initialIndicator]}</h2>
<div class="dataviz-container wire">
{#await dataPromise}
    <DatavizLoading {initialCities} />
{/await}    
</div>


