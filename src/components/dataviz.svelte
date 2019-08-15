<script>
    import dictionary from './../data/dictionary.json';
    import DatavizWaiting from './dataviz_waiting.svelte';
    import DatavizResolved from './dataviz_resolved.svelte';
    import { inViewSectionStore, scrolledToStore } from './../store.js';
    import { onMount } from 'svelte';
    export let initialCities;
    export let initialIndicator;
    export let groupedData;
    export let metadata


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
</style>

{#each groupedData as group}
    <section>
        <a class="section-anchor" id="anchor-{group.key}" data-key="{group.key}"></a>
        <h2 class="dataviz-heading">{dictionary[group.key] ? dictionary[group.key].label : group.key}</h2>
        <p class="description">{dictionary[group.key] ? dictionary[group.key].desc : ''}</p>
        <div class="dataviz-container">
            <DatavizResolved {group} {groupedData} {metadata} />
        </div>
        <a class="upward-observer-anchor" data-key="{group.key}"></a>
    </section>
{/each}

