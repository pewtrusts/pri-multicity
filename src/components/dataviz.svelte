<script>
    import dictionary from './../data/dictionary.json';
    import DatavizWaiting from './dataviz_waiting.svelte';
    import DatavizResolved from './dataviz_resolved.svelte';
    import { inViewSectionStore, scrolledToStore } from './../store.js';
    import { onMount } from 'svelte';
    export let initialCities;
    export let initialIndicator;
    export let data;
    export let metadata


    inViewSectionStore.subscribe(section => {
        var anchor = document.getElementById('anchor-' + section);
        if ( anchor ) {
            anchor.scrollIntoView();
        }
    });

    onMount(() => {
        console.log('hello', document.querySelectorAll('.section-anchor'));
        function callback(entries, observer){
            entries.forEach(entry => {
                if ( entry.isIntersecting ){
                    scrolledToStore.set(entry.target.dataset.key);
                }
                console.log(entry.target.id, entry.isIntersecting, observer);
            });
        }
        var observer = new IntersectionObserver(callback);
        document.querySelectorAll('.section-anchor').forEach(anchor => {
            console.log(anchor);
            observer.observe(anchor);
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
        top: calc(100vh - 185px);
        left: -10px;
        display: inline-block;
        width: 10px;
        //height: calc(100vh - 20px);
       // outline: 1px solid magenta;
        border-top: 2px solid magenta;
        border-bottom: 2px solid cyan;
        z-index: 10
    }
}
</style>

{#each data as indicator}
    <section>
        <a class="section-anchor" id="anchor-{indicator.key}" data-key="{indicator.key}"></a>
        <h2 class="dataviz-heading">{dictionary[indicator.key].label}</h2>
        <p class="description">{dictionary[indicator.key].desc}</p>
        <div class="dataviz-container">
            <DatavizResolved {indicator} {data} {metadata} />
        </div>
    </section>
{/each}

