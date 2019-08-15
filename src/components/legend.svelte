<script>
import d3 from './../d3-importer.js';
import { onMount } from 'svelte';
export let metadata;
export let maxRadius;
export let minRadius;

let zScaleDomain = [metadata.minPop, metadata.maxPop];
let viewBoxHeight = 75;

let margin = {
    top: 2,
    right: 5,
    bottom: 10,
    left: 5
};
let svg;

onMount(() => {
    
    const width = 100 - margin.left - margin.right;
    const height = viewBoxHeight - margin.top - margin.bottom;
    const zScale = d3.scaleSqrt().range([minRadius, maxRadius]).domain(zScaleDomain);
    const data = zScaleDomain;

    d3.select(svg).selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => zScale(d))
        .attr('cy', d => height - zScale(d))
        .attr('r', d => zScale(d));

}); // end onMount
</script>

<style lang="scss">
    .legend {
        width: 198px;
        position: absolute;
        :global(circle) {
            fill: #000;
            fill-opacity: 1;
        }
    }
</style>

<svg class="legend" bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 {viewBoxHeight}"></svg>
    