<script>
    import { onMount } from 'svelte';
    import { viewTypeStore, inViewSectionStore, scrolledToStore, groupByStore } from './../store.js';
    import UISvelte from '@Submodule/UI-svelte/';
    import dictionary from './../data/dictionary.json';
    import trendlineSVG from 'file-loader!./dataviz--trendline.svg';
    import Legend from './legend.svelte';
    export let groupedData;
    export let metadata;
    export let isSticky;


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
        flex-wrap: wrap;
        justify-content: space-between;
        @media screen and (min-width: 850px) {
            flex-wrap: nowrap;
        }
    }
    .selections > div {
        
        z-index: 2;
        
    }
     .view-type-selectors {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 0.3em;
        flex-shrink: 1;
        flex-grow: 1;
        max-width: 278px;
        > div {
            //flex-grow: 1;
            //width: 155px;
        }
        label {
            margin-left: 0.3em;
            position: relative;
            top: 0.125em;
        }
    }
    .selections-wrapper {
        //position: absolute;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-end;
        background-image: linear-gradient(#fff, #fff 90%, rgba(255,255,255,0));
        z-index: 2;
        padding: 10px 0;
        width: calc(100vw - 2.5rem);
        //width: 100%;
        max-width: 990px;
        @media screen and (min-width: 850px) {
            position: absolute;
        }
        &.is-sticky {
            @media screen and (min-width: 850px) {
                position: fixed;
                top: 98px;
                bottom: auto;
            }
            @media screen and (min-width: 56.876em) {
                top: 100px;
            }
        }
    } 
    .trendline-key {
        position: absolute;
        right: 0;
        bottom: -15px;
        background-image: linear-gradient(#fff, #fff 90%, rgba(255,255,255,0));
        img {
            bottom: 3px;
            position: relative;
        }
        p {
            margin-bottom: 0;
        }
    }
   
    @media screen and (max-width: 1019px){
        :global(.dropdown-outer) {
            display: flex;
            align-items: center;
            :global(label) {
                width: 90px;
                text-align: right;
            }
            
        }
        :global(.dropdown-inner) {
            flex-grow: 1;
        }
    }
</style>

<div class:is-sticky="{isSticky}" class="selections-wrapper">
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
    <Legend {metadata} maxRadius=15 minRadius=5 />   
</div>