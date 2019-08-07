<script>
    import Loading from './loading.svelte';
    export let initialCities;

</script>

<style lang="scss">

</style>

{#each initialCities as city}
<div class="graph-container--outer">
    <div class="graph-container">
    <h3>{city}</h3>
        <Loading />
    </div>
</div>
{/each}    


