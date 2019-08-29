<script>
    import { onMount } from 'svelte';
    import { viewTypeStore, inViewSectionStore, scrolledToStore, groupByStore } from './../store.js';
    import Loading from './loading.svelte';
    import UISvelte from '@Submodule/UI-svelte/';
    import dictionary from './../data/dictionary.json';
    import trendlineSVG from 'file-loader!./dataviz--trendline.svg';
    export let groupedData;
    export let metadata;


    let indicatorFirstValue;
    let groupSelectorLabel;
    let viewType;

    let organizeByOptions = [
        {
            value: 'nestedByIndicator',
            display: 'Indicator',
            isInitialSelected: true
        },{
            value: 'nestedByCity',
            display: 'City',
            isInitialSelected: false
        }
    ];

    export let typeSelectors;
    
    function createOptions(values){
        return values.map((value, i) => {
            return {
                value: value.key,
                display: dictionary[value.key] ? dictionary[value.key].label : value.key,
                isInitialSelected: i === 0
            };
        });
    }

    function dropdownItemOnClick(){
        inViewSectionStore.set(this.dataset.value);
    }

    function changeHandler(e){
        viewTypeStore.set(e.target.value)
    }

    function organizeItemOnClick(){
        groupByStore.set(this.dataset.value);
        indicatorFirstValue = this.dataset.value;
    }
    viewTypeStore.subscribe(value => {
        viewType = value;
    });
    groupByStore.subscribe(value => {
        var firstSectionAnchor = document.querySelector('.dataviz-section a.section-anchor');
        if ( firstSectionAnchor ){
            firstSectionAnchor.scrollIntoView();
        }
        groupSelectorLabel = organizeByOptions.find(d => d.value === value).display;
    });
    onMount(() => {
        typeSelectors.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', changeHandler);
        });
    });
</script>

<style lang="scss">
    .selections {
        width: 100%;
        display: flex;
    }
    .selections > div {
        width: 33%;
        
    }
     .view-type-selectors {
        display: flex;
        justify-content: space-around;
        align-items: center;
        label {
            margin-left: 0.3em;
            position: relative;
            top: .125em;
        }
    }
    .selections-anchor {
        position: absolute;
        top: -185px;
    }
    .selections-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: sticky;
        top: 100px;
        background-image: linear-gradient(#fff, #fff 90%, rgba(255,255,255,0));
        z-index: 2;
        padding: 10px 0;
    } 
    .trendline-key {
        img {
            bottom: 3px;
            position: relative;
        }
        p {
            margin-bottom: 0;
        }
    }

    :global(body){
        scroll-snap-type: y proximity;
        scroll-padding: 185px;
    }

</style>

<div class="selections-wrapper">
    <div class="selections">
        <div>
            <UISvelte.dropdown label="Organize by:" options="{organizeByOptions}" itemOnClick="{organizeItemOnClick}" />
        </div>
        <div>
            <UISvelte.dropdown label="{groupSelectorLabel}:" options="{createOptions(groupedData)}" itemOnClick="{dropdownItemOnClick}" subscribeTo="{scrolledToStore}" />
        </div>
        <div bind:this="{typeSelectors}" class="view-type-selectors">
            <div><input type="radio" name="view-type" value="time" id="radio1" checked="true" /><label for="radio1">Over time</label></div>
            <div><input type="radio" name="view-type" value="disaggregated" id="radio2" /><label for="radio2">By age and race</label></div>
        </div>
    </div>
    {#if viewType === 'time'}
    <div class="trendline-key">
        <p><img src="{trendlineSVG}" alt="blue line equals best fit trend line" /> = best fit trend line</p>
    </div>
    {/if}
</div>