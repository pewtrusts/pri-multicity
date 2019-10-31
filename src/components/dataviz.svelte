<script>
    import dictionary from './../data/dictionary.json';
    import DatavizResolved from './dataviz_resolved.svelte';
    import { inViewSectionStore, scrolledToStore, viewTypeStore } from './../store.js';
    import { beforeUpdate, afterUpdate, onMount } from 'svelte';
    import trendlineSVG from 'file-loader!./dataviz--trendline.svg';
    import tippy from 'tippy.js';
    export let groupedData;
    export let metadata
    export let groupBy;
    export let ACSErrorNote;

    let viewType;
    let headings = [];
    

    viewTypeStore.subscribe(view => {
        viewType = view;
    });

    inViewSectionStore.subscribe(section => {
        var anchor = document.getElementById('anchor-' + section);
        if ( anchor ) {
            anchor.modifiedScrollIntoView();
        }
    });
    let scrollY = 0;
    beforeUpdate(() => {
        headings.forEach(h => {
          //  if (h && h._tippy) h._tippy.destroy();
        });

    });
    afterUpdate(() => {
        headings.forEach(h => {
            if ( h && h.classList.contains('has-error')){
                tippy(h,{arrow:true, offset: '35, 0'});
            }
        });
    });
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

    function skipClickHandler(e){
        var index = this.dataset.linkTo;
        document.querySelector('.js-section-anchor-' + index).modifiedScrollIntoView();
        document.querySelector(this.hash).focus();
    }
    function backToTop(){
        document.querySelector('a[name="top"]').modifiedScrollIntoView(true);
    }

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
    display: inline-block;
    > span {
        color: $gray;
    }
    &.has-error {
        &:after {
            content: '*';
            color: #767676;
            font-size: 1.2em;
            position: relative;
            left: -0.25em;
            line-height: 0;

        }
    }
    
}
.description {
    margin-bottom: 1.5em;
    color: $gray;
    font-weight: 600;
    min-height: 25px;
}
section {
    position: relative;
    margin-bottom: 20px;
    a.observer-anchor {
        position: absolute;
        z-index: 9999;
        &.section-anchor {
            top: -88px;
            @media screen and (min-width: 850px) {
                top: -215px;
            }
        }
        &.upward-observer-anchor {
            top: calc(100vh - 225px);
        }
    }
}
.skip-link {
    height: 0;
    overflow: hidden;
    display: inline-block;
    position: relative;
    top: 3px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    &:focus {
        height: auto;
        opacity: 1;
    }
}
.back-to-top {
    display: inline;
    @media screen and (min-width: 850px) {
        display: none;
    }
}


</style>

{#each groupedData as group, i}
    <section class="dataviz-section">
        <a tabindex="-1" class="section-anchor observer-anchor js-section-anchor-{i}" id="anchor-{group.key}" data-key="{group.key}"></a>
        <h2 bind:this={headings[i]} tabindex="{viewType === 'time' && group.key === 'Philadelphia' ? '0' : '-1'}" data-tippy-content="{viewType === 'time' && group.key === 'Philadelphia' ? ACSErrorNote : ''}" class="dataviz-heading {viewType === 'time' && group.key === 'Philadelphia' ? 'has-error' : ''}">{dictionary[group.key] ? dictionary[group.key].label : group.key} <span>{viewType === 'time' ? '' : `(${metadata.stopYear})`}</span></h2>
        <a class="back-to-top" href="#top" on:click|preventDefault="{backToTop}">[back to top]</a>
        {#if i < groupedData.length - 1}
        <a class="skip-link js-skip-link-{group.key}" id="skip-link-{i}" name="skip-link-{i}" href="#skip-link-{i + 1}" data-link-to="{i + 1}" on:click|preventDefault="{skipClickHandler}">Skip to next section</a>
        {:else}
        <a class="skip-link js-skip-link-{group.key}" id="skip-link-{i}" name="skip-link-{i}" href="#skip-link-0" data-link-to="0" on:click|preventDefault="{skipClickHandler}">Back to first section</a>
        {/if}
        <p class="description">{dictionary[group.key] && dictionary[group.key].desc ? dictionary[group.key].desc + '.' : ''} {dictionary[group.key] && dictionary[group.key].source ? 'Source: ' + dictionary[group.key].source : ''}</p>
        <div class="dataviz-container">
            <DatavizResolved {group} {groupedData} {metadata} {groupBy} {tippy} {ACSErrorNote} />
        </div>
        <a class="upward-observer-anchor observer-anchor" data-key="{group.key}"></a>
    </section>
{/each}

