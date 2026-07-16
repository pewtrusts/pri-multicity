<script>
import './components/style.css'
    import Selections from  './components/selections.svelte';
    import Dataviz from  './components/dataviz.svelte';
    import { groupByStore } from './store.js';
    import { onMount } from 'svelte';
    export let data; // {nestedByIndicator, nestedByCity}
    export let metadata;

    let groupedData;
    let groupBy;
    let isSticky = false;
    let wheelEventHasBeenUsed = false;
    let ACSErrorNote = 'In September 2019, the U.S. Census Bureau identified an error in its 2017 data for Philadelphia. The error affects all indicators in this interactive except unemployment rate, homicide rate, and population. The affected graphs do not display 2017 data.';

    groupByStore.subscribe(value => {
        groupedData = data[value];
        groupBy = value;
    });

    onMount(() => {
          function observerCallback(entries, observer){
            entries.forEach(entry => {
                if ( entry.isIntersecting ){
                    isSticky = true;
                } else {
                    isSticky = false;
                }
            });
        }
        var observer = new IntersectionObserver(observerCallback);
        observer.observe(document.querySelector('.dataviz-observer-anchor'));
        
    });
    
    
</script>

<style lang="scss">
    :global(#pew-app) {
        margin-top: -40px;
    }
    :global(.wire), :global(.wire) * {
        outline: 1px solid magenta;
    }  
    .dataviz-wrapper {
        position: relative;
        margin-top: 10px;
    }
    .dataviz-observer-anchor {
        position: absolute;
        top: calc(100vh - 295px);
        height: 100%;
    }
    .top-container {
        position: sticky;
        z-index: 1;
          @media screen and (min-width: 767px) {
                top: 135px;

            }
            @media screen and (min-width: 67.5625rem) {
                top: 160px;
            }
        @media screen and (min-width: 850px) {
            padding-bottom: 115px;
        }
    }
    .top-anchor {
        position: absolute;
        top: -98px;
    }
</style>
<a class="top-anchor" name="top"></a>
<div class="top-container">
    <Selections {groupedData} {metadata} />
</div>
<div class="dataviz-wrapper" class:by-city="{groupBy === 'nestedByCity'}" >
    <a tabindex="-1" class="dataviz-observer-anchor"></a>
    <Dataviz {groupedData} {metadata} {groupBy} {ACSErrorNote}/>
</div>

