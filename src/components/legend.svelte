<script>
import d3 from './../d3-importer.js';
import { onMount } from 'svelte';
import { viewTypeStore } from './../store.js';
import UISvelte from '@Submodule/UI-svelte/';
export let metadata;
export let maxRadius;
export let minRadius;

let viewType;
let isClosed = false;

function convertToMagnitude(n) {
    var order = Math.round(Math.log(n) / Math.LN10 +
        0.000000001); // because float math sucks like that
    return Math.pow(10, order);
}

let zScaleDomain = [metadata.minPop, metadata.maxPop];
let viewBoxHeight = 100/3.19;

let margin = {
    top: 0,
    right: 0,
    bottom: 0.5,
    left: 2
};
let svg;

viewTypeStore.subscribe(value => {
    viewType = value;
});

onMount(() => {

    const width = 100 - margin.left - margin.right;
    const height = viewBoxHeight - margin.top - margin.bottom;
    const zScale = d3.scaleSqrt().range([minRadius, maxRadius]).domain(zScaleDomain);
    const data = zScaleDomain.map(d => convertToMagnitude(d));//.concat([minRadius / 2]);

    var group = d3.select(svg).selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(${margin.left + +zScale(data[1])}, ${height - zScale(d)})`);

    group.append('circle')
        .attr('r', (d, i) => zScale(d));

    group.append('text')
        .attr('class', 'circle-label')
        .attr('transform', (d, i) => i === 1 ? `translate(0, ${0 - +zScale(d) + 7.5})` : `translate(0, ${0 - +zScale(d) - 1})` )
        .text((d, i) => d3.format('.0s')(d));




}); // end onMount

function clickHandler(e){
    console.log(e);
    isClosed = !isClosed;
}
</script>
<style lang="scss">
@import './../variables.scss';


.legend-container {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(0);
    transition: transform 0.2s ease-in-out;
    
    z-index: 1;
    opacity: 1;
    display: flex;
    justify-content: flex-end;
    &.isClosed {
        transform: translateY(100%);
        //opacity: 0;
    }
    &.hide {
        display: none;
    }
}

.legend-container-inner {
    position: relative;
    display: inline-block;
    max-width: 1030px;
    display: flex;
    justify-content: flex-end;
    padding-bottom: 5px;
    transition:  opacity 0.2s ease-in-out;
    opacity: 1;
    //background-color: rgba(255,255,255,0.9);
    background-color: #fff;
    border: 1px solid $gray;
    .isClosed & {
        opacity: 0;
    }
}

.legend-container-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 0 22px 0;
    
    > div:first-child {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-end;
        h2 {
            font-size: 1.5em;
            text-align: left;
            margin-bottom: 0;
        }
    }
}

.legend {

    display: flex;

    .color-codes {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        flex-wrap: wrap;
        flex-grow: 1;
        justify-content: space-between;


        > div {
            display: flex;
            min-width: 130px;
            flex-grow: 1;
            margin-top: 0.75em;
            


            h3 {
                display: inline-block;
                margin-right: 0.5em;
                width: 40px;
                text-align: right;
                
            }
        }

    }

    li {
        margin-bottom: 0;
    }


}
.legend-svg-container {
  //  flex-grow: 1;
}
.population-legend {
    width: 62px;
    margin-bottom: -5px;

    :global(circle) {
        fill: none;
        stroke: $blue;
    }

    :global(.circle-label) {
        font-size: 7.5px;
        text-anchor: middle;
    }
}

h3 {
    font-size: 16px;
    margin: 0;
}

ul {
    margin: 0;
    padding: 0;
    text-indent: 0;
    list-style-type: none;
}

li {
    display: inline-block;
    margin-right: 8px;

    &::before {
        content: '';
        display: inline-block;
        height: 12px;
        width: 12px;
        border-radius: 6px;
        margin-right: 4px;
    }

    &:nth-child(1) {
        &::before {
            background-color: $teal;
        }
    }

    &:nth-child(2) {
        &::before {
            background-color: $orange;
        }
    }

    &:nth-child(3) {
        &::before {
            background-color: $red;
        }
    }

    &:nth-child(4) {
        &::before {
            background-color: $light_blue;
        }
    }

}
.x-out-container {
    display: block;
    position: absolute;
    top: 20px;
    right: 5px;
}
.show-legend {
    color: $dark_blue;
    position: absolute;
    top: -34px;
    right: 0;
    padding: 0.5em;
    border: 2px solid $blue;
    margin: 0;
    overflow: visible;
    color: inherit;
    font: inherit;
    line-height: normal;
}
</style>
<div class:isClosed="{isClosed}" class:hide="{ viewType === 'time' }" class="legend-container">
    <div class="legend-container-inner">
        <div class="legend-container-wrapper">
            <div>
                <div class="legend">
                    <div class="color-codes">
                        <div>
                            <h3>Age:</h3>
                            <ul>
                                <li>&lt;35</li>
                                <li>35–64</li>
                                <li>65+</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Race:</h3>
                            <ul>
                                <li>White, non-Hispanic</li>
                                <li>Black</li>
                                <li>Hispanic</li>
                                <li>Asian</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="legend-svg-container">
                <svg class="population-legend" bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 {viewBoxHeight} {viewBoxHeight}"></svg>
            </div>
            <div on:click="{clickHandler}" class="x-out-container">
                <UISvelte.xOut />
            </div>
        </div>
    </div>
    {#if isClosed}
    <button on:click="{clickHandler}" class="show-legend">Show legend</button>
    {/if}
</div>
