<script>
    import Chart from './chart.svelte';
    export let initialIndicator;
    export let data;
    export let metadata
    let match = data.find(d => d.key === initialIndicator);
</script>

<style lang="scss">
    :global(.graph-container--outer) {
        width: 198px;
        flex-grow: 1;
        margin-bottom: 50px;    
    }
    :global(.graph-container) {
        width: 100%;
        height: 0;
        padding-bottom: 131%;
        :global(h3) {
            font-size: 16px;
            width: 100%;
            text-align: center;      
            font-weight: 900;
            padding-left: 20%;
        }
    }
    :global(.graph-container--outer .y-axis) {
        display: none;
    } 
    :global(.graph-container--outer):nth-of-type(5n+1){
        :global(.y-axis) {
            display: inline;
        }
    }
</style>

{#each match.values as d}
<div class="graph-container--outer">
    <div class="graph-container">
        <h3>{d.key}</h3>
        <Chart datum={d} {metadata} />
    </div>
</div>
{/each}    


