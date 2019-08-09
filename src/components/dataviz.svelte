<script>
    import dictionary from './../data/dictionary.json';
    import DatavizWaiting from './dataviz_waiting.svelte';
    import DatavizResolved from './dataviz_resolved.svelte';
    export let initialCities;
    export let initialIndicator;
    export let dataPromise;
    export let metadata
console.log(dictionary);
</script>
<style lang="scss">
@import './../variables.scss';
.dataviz-container {
    display: flex;
    flex-wrap: wrap;
}

.dataviz-heading {
    font-size: 1.5em;
    margin-bottom: 0;
    
}
.description {
    margin-bottom: 1.5em;
    color: $gray;
    font-weight: 600;
}
</style>

{#await dataPromise}
    <div class="dataviz-container">
        <DatavizWaiting {initialCities} />
    </div>
{:then data}
{#each data as indicator}
    <h2 class="dataviz-heading">{dictionary[indicator.key].label}</h2>
    <p class="description">{dictionary[indicator.key].desc}</p>
    <div class="dataviz-container">
        <DatavizResolved {indicator} {data} {metadata} />
    </div>
{/each}
{/await}
