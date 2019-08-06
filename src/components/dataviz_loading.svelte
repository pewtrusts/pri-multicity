<script>
    import Loading from './loading.svelte';
    export let initialCities;

</script>

<style lang="scss">
    .graph-container {
        width: 198px;
        height: 340px;
        flex-grow: 1;
        h3 {
            width: 100%;
            text-align: center;      
        }
    }
</style>

{#each initialCities as city}
    <div class="graph-container">
    <h3>{city}</h3>
        <Loading />
    </div>
{/each}    


