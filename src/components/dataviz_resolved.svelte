<script>
    import TimeChart from './chart_time.svelte';
    import BubbleChart from './chart_bubble.svelte';
    import { beforeUpdate, afterUpdate } from 'svelte';
    import { viewTypeStore, groupByStore } from './../store.js';
    import dictionary from './../data/dictionary.json';
    import tippy from 'tippy.js';

    export let group;
    export let groupedData;
    export let metadata;
    export let groupBy;

    let viewType;
    let headings = [];

    $: match = groupedData.find(d => d.key === group.key);

    viewTypeStore.subscribe(view => {
        viewType = view;
        destroyD3Tips();
    });
    groupByStore.subscribe(() => {
        destroyD3Tips();
    });

    // THIS WOULD PROBABLY BE HANDLED BETTER BY MAKING A COMPONENT OUT OF THE HEADING SO THAT EACH ONE
    // WOULD HAVE ITS OWN LIFECYCLE
    beforeUpdate(() => {
        console.log('beforeUpdate:',headings);
        if ( groupBy === 'nestedByIndicator' ){
            headings.forEach(h => {
                if (h && h._tippy) h._tippy.destroy();
            });
        }
    });
    afterUpdate(() => {
        console.log('afterUpdate:',headings);
       if ( groupBy !== 'nestedByIndicator' ){
            headings.forEach(h => {
                tippy(h,{arrow:true, offset: '35, 0'});
            });
        } 
    });

    function destroyD3Tips(){
        document.querySelectorAll('.d3-tip').forEach(tip => {
            tip.parentNode.removeChild(tip);
        });
    }

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
            font-weight: 600;
            padding-left: 20%;
            position: absolute;
            &.philadelphia {
                font-weight: 900;
            }
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
    .with-tooltip {
        &::after {
            position: absolute;
            bottom: 2px;
            margin-left: 0.2em;
            content: '';
            display: inline-block;
            width: 14px;
            height: 14px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 924 922.666015625'%3E%3Cpath fill='%23cacaca' d='M456.667 1.333c126.667-1.333 235.333 42 326 130s137.333 195.333 140 322C924 580 880.334 689 791.667 780.333s-196.333 138.333-323 141C342 922.666 233 879 141.667 790.333S4 594 2.667 467.333c-2.667-126.667 40.667-235.667 130-327s197.333-137.667 324-139m52 152c-28 0-49.667 8-65 24-15.333 16-23 32.667-23 50-1.333 18.667 3.667 33.333 15 44 11.333 10.667 27.667 16 49 16 25.333 0 45.667-7.333 61-22 15.333-14.667 23-32.667 23-54 0-38.667-20-58-60-58m-120 594c20 0 48-8.667 84-26s71.333-43.333 106-78l-18-24c-32 24-56 36-72 36-9.333 0-10.667-12.667-4-38l42-160c17.333-64 10-96-22-96-20 0-49.667 9.667-89 29s-77.667 44.333-115 75l16 26c34.667-22.667 59.333-34 74-34 8 0 8 11.333 0 34l-36 152c-17.333 69.333-6 104 34 104'%3E%3C/path%3E%3C/svg%3E");
        }
        &:hover::after, &:focus::after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 924 922.666015625'%3E%3Cpath fill='%23296EC3' d='M456.667 1.333c126.667-1.333 235.333 42 326 130s137.333 195.333 140 322C924 580 880.334 689 791.667 780.333s-196.333 138.333-323 141C342 922.666 233 879 141.667 790.333S4 594 2.667 467.333c-2.667-126.667 40.667-235.667 130-327s197.333-137.667 324-139m52 152c-28 0-49.667 8-65 24-15.333 16-23 32.667-23 50-1.333 18.667 3.667 33.333 15 44 11.333 10.667 27.667 16 49 16 25.333 0 45.667-7.333 61-22 15.333-14.667 23-32.667 23-54 0-38.667-20-58-60-58m-120 594c20 0 48-8.667 84-26s71.333-43.333 106-78l-18-24c-32 24-56 36-72 36-9.333 0-10.667-12.667-4-38l42-160c17.333-64 10-96-22-96-20 0-49.667 9.667-89 29s-77.667 44.333-115 75l16 26c34.667-22.667 59.333-34 74-34 8 0 8 11.333 0 34l-36 152c-17.333 69.333-6 104 34 104'%3E%3C/path%3E%3C/svg%3E");
        }
    }

    /* tippy overrides */

    :global(.tippy-tooltip[data-animatefill]) {
        background-color: #fff;
        overflow-y: visible;
    }
    :global(.tippy-tooltip) {
        background-color: #fff;
        color: #333;
        border: 1px solid $gray;
        overflow-y: visible;
    }
    :global(.tippy-backdrop){
        background-color: #fff;
    }

:global(.tippy-popper[x-placement^=top] .tippy-arrow) {
    border-top-color: $gray;
    border-right-width: 6px;
    border-left-width: 6px;
    bottom: -8px;
    transform: translate(32px, 0)
}
</style>

{#each match.values as d, i}
<div class="graph-container--outer">
    <div class="graph-container">
        <h3 bind:this="{headings[i]}" class="{d.key.toLowerCase()}" data-tippy-content="{dictionary[d.key] ? dictionary[d.key].desc : ''}" tabindex="{groupBy !== 'nestedByIndicator' ? 0 : -1}" class:with-tooltip="{groupBy !== 'nestedByIndicator'}">{dictionary[d.key] ? dictionary[d.key].label : d.key}</h3>
        {#if viewType === 'time'}
        <TimeChart instanceIndex="{i}" datum={d} {metadata} group="{group.key}" />
        {:else}
        <BubbleChart instanceIndex="{i}" datum={d} {metadata} {groupBy} group="{group.key}" />
        {/if}
    </div>
</div>
{/each}    


