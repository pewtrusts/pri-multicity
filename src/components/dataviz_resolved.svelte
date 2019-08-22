<script>
    import TimeChart from './chart_time.svelte';
    import BubbleChart from './chart_bubble.svelte';
    import { viewTypeStore } from './../store.js';
    import { onMount } from 'svelte';
    import dictionary from './../data/dictionary.json';
    export let group;
    export let groupedData;
    export let metadata;
    export let groupBy;
    let viewType;
    console.log(group);
    $: match = groupedData.find(d => d.key === group.key);
    viewTypeStore.subscribe(view => {
        viewType = view;
    });
    
</script>

<style lang="scss">
    @import './../variables.scss';
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
    .info-mark path {
        fill: #cacaca;
        transition: fill 0.2s ease-in-out
        :hover & {
            fill: $blue;
        }
    }

</style>

{#each match.values as d}
<div class="graph-container--outer">
    <div class="graph-container">
        <h3>{#if groupBy !== 'nestedByIndicator'}<svg class="info-mark" width="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 924 922.666015625"><path d="M456.667 1.333c126.667-1.333 235.333 42 326 130s137.333 195.333 140 322C924 580 880.334 689 791.667 780.333s-196.333 138.333-323 141C342 922.666 233 879 141.667 790.333S4 594 2.667 467.333c-2.667-126.667 40.667-235.667 130-327s197.333-137.667 324-139m52 152c-28 0-49.667 8-65 24-15.333 16-23 32.667-23 50-1.333 18.667 3.667 33.333 15 44 11.333 10.667 27.667 16 49 16 25.333 0 45.667-7.333 61-22 15.333-14.667 23-32.667 23-54 0-38.667-20-58-60-58m-120 594c20 0 48-8.667 84-26s71.333-43.333 106-78l-18-24c-32 24-56 36-72 36-9.333 0-10.667-12.667-4-38l42-160c17.333-64 10-96-22-96-20 0-49.667 9.667-89 29s-77.667 44.333-115 75l16 26c34.667-22.667 59.333-34 74-34 8 0 8 11.333 0 34l-36 152c-17.333 69.333-6 104 34 104"></path></svg>{/if} {dictionary[d.key] ? dictionary[d.key].label : d.key}</h3>
        {#if viewType === 'time'}
        <TimeChart datum={d} {metadata} group="{group.key}" />
        {:else}
        <BubbleChart datum={d} {metadata} {groupBy} group="{group.key}" />
        {/if}
    </div>
</div>
{/each}    


