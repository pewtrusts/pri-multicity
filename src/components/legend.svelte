<script>
import d3 from './../d3-importer.js';
import { onMount } from 'svelte';
import { viewTypeStore } from './../store.js';
export let metadata;
export let maxRadius;
export let minRadius;

let viewType;

function convertToMagnitude(n) {
    var order = Math.round(Math.log(n) / Math.LN10
                       + 0.000000001); // because float math sucks like that
    return Math.pow(10,order);
}

let zScaleDomain = [metadata.minPop, metadata.maxPop];
let viewBoxHeight = maxRadius * 2 + 12;

let margin = {
    top: 0,
    right: 0,
    bottom: 7,
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
    const data = zScaleDomain.map(d => convertToMagnitude(d)).concat([ minRadius / 2]);

    var group = d3.select(svg).selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', (d,i) => i !== 2 ? `translate(${margin.left + +zScale(data[1])}, ${height - zScale(d)})` : `translate(${margin.left + +zScale(data[1])},${height - d})`);
        
    group.append('circle')
        .attr('r', (d,i) => i === 2 ? d : zScale(d));

    group.append('text')
        .attr('class', 'circle-label')
        .attr('transform', (d,i) => i !== 2 ? `translate(0, ${0 - +zScale(d) - 2})` : `translate(0, ${d * 2 + 4} )`)
        .text((d,i) => i !== 2 ? d3.format('.0s')(d) : 'n/a');
        



}); // end onMount
</script>

<style lang="scss">
    @import './../variables.scss';
    .hide {
        display: none;
    }
    .legend-container {
        position: fixed;
        bottom:10px;
        left: 0;
        width: 100%;
    }
    .legend-container-inner {
        position: relative;
        width: 100%        ;
        max-width: 990px;
        margin: 0 auto;
        display: flex;
        justify-content: flex-end;
    }
    .legend-container-wrapper {
        display: inline-block;
        border: 2px solid $blue;
        background-color: #fff;
        h2 {
            font-size: 1.5em;
            width: 100%;
            text-align: center;
            margin-bottom: 0;
        }
    }
    .legend {

        padding:5px;
        display: flex;
        .color-codes {
            display: flex;
            flex-direction: column;
        }


    }
    .population-legend {
        width: 62px;
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
      margin:0;
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
                background-color: $orange ;
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

</style>

<div class:hide="{ viewType === 'time' }" class="legend-container">
<div class="legend-container-inner">
<div class="legend-container-wrapper">
    <h2>Legend</h2>
    <div class="legend">
    <div class="color-codes">
        <div>
            <h3>Age:</h3>
            <ul>
                <li>&lt;35</li>
                <li>35–64</li>
                <li>64+</li>
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
    <svg class="population-legend" bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 {100/3.19} {viewBoxHeight}"></svg>
</div>
</div>
</div>
</div>