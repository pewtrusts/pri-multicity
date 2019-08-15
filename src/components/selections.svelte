<script>
    import { onMount } from 'svelte';
    import { viewTypeStore, inViewSectionStore, scrolledToStore, groupByStore } from './../store.js';
    import Loading from './loading.svelte';
    import Dropdown from './dropdown.svelte';
    import dictionary from './../data/dictionary.json';
    export let groupedData;
    let indicatorFirstValue;

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
    groupByStore.subscribe(() => {
        var firstSectionAnchor = document.querySelector('.dataviz-section a.section-anchor');
        if ( firstSectionAnchor ){
            firstSectionAnchor.scrollIntoView();
        }
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
        position: sticky;
        top: 100px;
        padding: 10px 0;
        background-image: linear-gradient(#fff, #fff 90%, rgba(255,255,255,0));
        z-index: 2;
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
</style>

<div class="selections">
    <div>
        <Dropdown label="Organize by:" options="{organizeByOptions}" itemOnClick="{organizeItemOnClick}" />
    </div> 
    <div>
        <Dropdown label="Indicator:" options="{createOptions(groupedData)}" itemOnClick="{dropdownItemOnClick}" subscribeTo="{scrolledToStore}"  />
    </div>        
    <div bind:this="{typeSelectors}" class="view-type-selectors">
        <div><input type="radio" name="view-type" value="time" id="radio1" checked="true" /><label for="radio1">Over time</label></div>
        <div><input type="radio" name="view-type" value="disaggregated" id="radio2" /><label for="radio2">By age and race</label></div>
    </div>        
</div>
