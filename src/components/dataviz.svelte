<script>
    import dictionary from './../data/dictionary.json';
    import DatavizWaiting from './dataviz_waiting.svelte';
    import DatavizResolved from './dataviz_resolved.svelte';
    import { inViewSectionStore, scrolledToStore, viewTypeStore } from './../store.js';
    import { onMount } from 'svelte';
    import trendlineSVG from 'file-loader!./dataviz--trendline.svg';
    export let initialCities;
    export let initialIndicator;
    export let groupedData;
    export let metadata
    export let groupBy;

    let viewType;

    viewTypeStore.subscribe(view => {
        viewType = view;
    });

    inViewSectionStore.subscribe(section => {
        var anchor = document.getElementById('anchor-' + section);
        if ( anchor ) {
            anchor.scrollIntoView();
        }
    });
    let scrollY = 0;
    onMount(() => {
        
        function downwardCallback(entries, observer){
            entries.forEach(entry => {
                var newScrollY = window.pageYOffset;
                if ( entry.isIntersecting && newScrollY < scrollY ){
                    scrolledToStore.set(entry.target.dataset.key);
                }
                scrollY = newScrollY;
            });
        }
        var downwardObserver = new IntersectionObserver(downwardCallback);
        document.querySelectorAll('.section-anchor').forEach(anchor => {
            downwardObserver.observe(anchor);
        });

        function upwardCallback(entries, observer){
            entries.forEach(entry => {
                console.log(entry, scrollY, window.pageYOffset);
                var newScrollY = window.pageYOffset;
                if ( entry.isIntersecting && newScrollY >= scrollY ){ // greater than or equal to trigger on page load to nonzero scroll
                    scrolledToStore.set(entry.target.dataset.key);
                }
                scrollY = newScrollY;
            });
        }
        var upwardObserver = new IntersectionObserver(upwardCallback);
        document.querySelectorAll('.upward-observer-anchor').forEach(anchor => {
            upwardObserver.observe(anchor);
        });


       
    });

</script>
<style lang="scss">
@import './../variables.scss';


.dataviz-container {
    display: flex;
    flex-wrap: wrap;
}

.dataviz-heading {
    font-size: 1.5em;
    margin-bottom: 0;
    margin-top: 1em;
    
}
.description {
    margin-bottom: 1.5em;
    color: $gray;
    font-weight: 600;
}
section {
    position: relative;
    margin-bottom: 20px;
    
    a {
        position: absolute;
        &.section-anchor {
            top: -185px;
        }
        &.upward-observer-anchor {
            top: calc(100vh - 225px);
        }
    }
}

.trendline-key {
    position: absolute;
    top: 0;
    right: 0;
    img {
        bottom: 3px;
        position: relative;
    }
    @media screen and (max-width: 360px){
        position: relative;
    }
}
</style>

{#if viewType === 'time'}
<div class="trendline-key">
    <p><img src="{trendlineSVG}" alt="blue line equals best fit trend line" /> = best fit trend line</p>
</div>
{/if}
{#each groupedData as group}
    <section class="dataviz-section">
        <a class="section-anchor" id="anchor-{group.key}" data-key="{group.key}"></a>
        <h2 class="dataviz-heading">{dictionary[group.key] ? dictionary[group.key].label : group.key}</h2>
        <p class="description">{dictionary[group.key] ? dictionary[group.key].desc : ''}</p>
        <div class="dataviz-container">
            <DatavizResolved {group} {groupedData} {metadata} {groupBy} />
        </div>
        <a class="upward-observer-anchor" data-key="{group.key}"></a>
    </section>
{/each}

