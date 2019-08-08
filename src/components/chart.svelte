<script>
    
    import { onMount } from 'svelte';
    import d3 from './../d3-importer.js';
    export var datum;
    export let metadata;
    var svg;
    
    const viewBoxHeight = 150;

    onMount(() => {
        
        // parameters / presettings
        const margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
        const width = 100 - margin.left - margin.right;
        const height = viewBoxHeight - margin.top - margin.bottom;
        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
            // define the line
        const valueline =  d3.line()
            .x((d) => { return xScale(d.year); })
            .y((d) => { return yScale(d.value); });
        const yearRange = d3.range(metadata.startYear, metadata.stopYear).concat(metadata.stopYear);
        const parseTime = d3.timeParse('%Y');
        const data = yearRange.map(year => {
            return {
                year: parseTime(year),
                value: datum.values[0][year] 
            };
        });
        // data-dependent settings
        console.log(data);
        xScale.domain(d3.extent(data, d => d.year));
        yScale.domain([metadata[datum.values[0].indicator].minYear, metadata[datum.values[0].indicator].maxYear]);
        const $svg = d3.select(svg);
        //render valueline
        const chart = $svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        chart.append('path')
            .datum(data)
            .attr('class', 'valueline')
            .attr('d', valueline);

        //render x-axis
        const xAxis = $svg.append('g')
          .attr('transform', `translate(0, ${height - 10})`)
          .attr('class', 'axis x-axis')
          .call(d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(0).tickValues(d3.extent(data, d => d.year)));//.tickFormat(d3.timeFormat('%Y')));


    

    }); // end onMount


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
    :global(.valueline) {
        fill: none;
        stroke: #000;
        vector-effect: non-scaling-stroke;

    }
    :global(.axis) path {
        vector-effect: non-scaling-stroke;

    }
</style>
<div class="svg-container">
    <svg bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 {viewBoxHeight}">
    </svg>
</div>



