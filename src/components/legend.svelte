<script>
import d3 from './../d3-importer.js';
import { onMount } from 'svelte';
import { viewTypeStore } from './../store.js';
import UISvelte from '@Submodule/UI-svelte/';
export let metadata;
export let maxRadius;
export let minRadius;

let viewType;
let isClosed = true;

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
@import './legend.scss';


</style>

<div class:isClosed="{isClosed}" class:hide="{ viewType === 'time' }" class="legend-container">
    <div class="legend-container-inner">
        <div class="legend-container-wrapper">
            <div>
                <div class="legend">
                    <div class="color-codes">
                        <div>
                            <h3>Race:</h3>
                            <ul>
                                <li>White, non-Hispanic</li>
                                <li>Black</li>
                                <li>Hispanic</li>
                                <li>Asian</li>
                            </ul>
                        </div>
                        <div>
                            <h3>Age:</h3>
                            <ul>
                                <li>&lt;35</li>
                                <li>35–64</li>
                                <li>65+</li>
                            </ul>
                        </div>
                        <div>
                            <div class="agreggated-dash"></div> = age/race not available
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
