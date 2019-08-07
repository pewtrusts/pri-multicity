<script>
    import Chart from './chart.svelte';
    export let initialIndicator;
    export let data;
    let match = data.find(d => d.key === initialIndicator);
</script>

<style lang="scss">
    :global(.graph-container--outer) {
        width: 198px;
        flex-grow: 1;
    }
    :global(.graph-container) {
        width: 100%;
        height: 0;
        padding-bottom: 172%;
        h3 {
            width: 100%;
            text-align: center;      
        }
    }
</style>

{#each match.values as d}
<div class="graph-container--outer">
    <div class="graph-container">
        <h3>{d.key}</h3>
        <Chart datum={d} />
    </div>
</div>
{/each}    


