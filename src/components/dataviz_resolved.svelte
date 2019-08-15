<script>
    import TimeChart from './chart_time.svelte';
    import BubbleChart from './chart_bubble.svelte';
    import { viewTypeStore } from './../store.js';
    import dictionary from './../data/dictionary.json';
    export let group;
    export let groupedData;
    export let metadata;
    let viewType;
    console.log(group);
    $: match = groupedData.find(d => d.key === group.key);
    viewTypeStore.subscribe(view => {
        viewType = view;
    });
    
</script>

<style lang="scss">
    
    :global(.graph-container--outer) {
        width: 198px;
        margin-bottom: 50px;    
    }
    :global(.graph-container) {
        width: 100%;
        height: 0;
        padding-bottom: calc(131% + 20px);
        position: relative;
        :global(h3) {
            font-size: 16px;
            width: 100%;
            text-align: center;      
            font-weight: 900;
            padding-left: 20%;
            position: absolute;
        }
    }
    :global(.graph-container--outer .y-axis) {
        display: none;
        .by-city & {
            display: inline;
        }
    } 
    :global(.graph-container--outer):nth-of-type(5n+1){
        :global(.y-axis) {
            display: inline;
        }
    }
    :global(.by-city .graph-container--outer .y-axis){
        display: inline;
    }

</style>

{#each match.values as d}
<div class="graph-container--outer">
    <div class="graph-container">
        <h3>{dictionary[d.key] ? dictionary[d.key].label : d.key}</h3>
        {#if viewType === 'time'}
        <TimeChart datum={d} {metadata} />
        {:else}
        <BubbleChart datum={d} {metadata} />
        {/if}
    </div>
</div>
{/each}    


