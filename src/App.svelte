<script>
    import Selections from  './components/selections.svelte';
    import Dataviz from  './components/dataviz.svelte';
    import { groupByStore } from './store.js';
    import { onMount } from 'svelte';
    export let data; // {nestedByIndicator, nestedByCity}
    export let metadata;

    let groupedData;
    let groupBy;
    let isSticky = false;

    groupByStore.subscribe(value => {
        groupedData = data[value];
        groupBy = value;
    });

    onMount(() => {
          function observerCallback(entries, observer){
            entries.forEach(entry => {
                console.log('yeahdog', entry, scrollY, window.pageYOffset);
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

<style>
    :global(.wire), :global(.wire) * {
        outline: 1px solid magenta;
    }  
    .dataviz-wrapper {
        position: relative;
    }
    .dataviz-observer-anchor {
        position: absolute;
        top: calc(100vh - 185px);
        height: 100%;
    }
    .top-container {
        position: relative;
        padding-bottom: 85px;
    }
</style>

<div class="top-container">
    <Selections {isSticky} {groupedData} {metadata} />
</div>
<div class="dataviz-wrapper" class:by-city="{groupBy === 'nestedByCity'}" >
    <a tabindex="-1" class="dataviz-observer-anchor"></a>
    <Dataviz {groupedData} {metadata} {groupBy} />
</div>

