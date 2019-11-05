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
    let wheelEventHasBeenUsed = false;
    let ACSErrorNote = 'In September 2019, the U.S. Census Bureau identified an error in its 2017 data for Philadelphia. The error affects all indicators in this interactive except unemployment rate, homicide rate, and population. The affected graphs do not display 2017 data.';

    Element.prototype.modifiedScrollIntoView = function(){
        //document.body.classList.add('no-snap');
        this.scrollIntoView(arguments);
       // document.body.classList.remove('no-snap');
    };
    /*document.body.addEventListener('wheel', function(e){
        console.log(e);
        document.body.classList.add('no-snap');
        wheelEventHasBeenUsed = true;
    });*/
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
    :global(.wire), :global(.wire) * {
        outline: 1px solid magenta;
    }  
    .dataviz-wrapper {
        position: relative;
    }
    .dataviz-observer-anchor {
        position: absolute;
        top: calc(100vh - 215px);
        height: 100%;
    }
    .top-container {
        position: relative;
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
    <Selections {isSticky} {groupedData} {metadata} />
</div>
<div class="dataviz-wrapper" class:by-city="{groupBy === 'nestedByCity'}" >
    <a tabindex="-1" class="dataviz-observer-anchor"></a>
    <Dataviz {groupedData} {metadata} {groupBy} {ACSErrorNote}/>
</div>

