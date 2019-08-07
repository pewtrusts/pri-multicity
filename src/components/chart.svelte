<script>
    
    import { onMount } from 'svelte';
    import d3 from './../d3-importer.js';
    export var datum;
    var svg;
    
    const viewBoxHeight = 150;

    onMount(() => {
        const margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
        const width = 100 - margin.left - margin.right;
        const height = viewBoxHeight - margin.top - margin.bottom;
        
        const parseTime = d3.timeParse('%Y');

        // set the ranges
        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
        

        const chart = d3.select(svg)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // define the line
        const valueline =  d3.line()
            .x((d) => { return xScale(d.date); })
            .y((d) => { return yScale(d.value); });
    });


</script>

<style lang="scss">
    .svg-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 150%;
        svg {
            position: absolute;
        }
    }
</style>
<div class="svg-container">
    <svg bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 {viewBoxHeight}">
    </svg>
</div>



