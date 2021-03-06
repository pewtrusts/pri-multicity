<script>
    
    import { beforeUpdate } from 'svelte';
    import d3 from './../d3-importer.js';
    import dictionary from './../data/dictionary.json';
    import shared from './chart_shared.js';
    export var datum;
    export let metadata;
    export let group;
    
    import './../d3-tip.scss';
// Sveltey way would be to have Chart component that passes these properties as props to the the specific chart types
    var { clearExisting, goToSectionStart, height, locale, margin, returnNumberFormats, svg, viewBoxHeight, width, yScale } = shared;

    function firstNonNullIndex(data){
        return data.findIndex(d => d.value !== null);
    };
    
    // HT: http://bl.ocks.org/benvandyke/8459843. returns slope, intercept and r-square of the line
    function leastSquares(xSeries, ySeries) {
        var reduceSumFunc = function(prev, cur) { return prev + cur; };
        
        var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
        var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

        var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
            .reduce(reduceSumFunc);
        
        var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
            .reduce(reduceSumFunc);
            
        var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
            .reduce(reduceSumFunc);
            
        var slope = ssXY / ssXX;
        var intercept = yBar - (xBar * slope);
        var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
        
        return [slope, intercept, rSquare];
    }
    beforeUpdate(() => {
        
        if ( svg ){
            clearExisting(svg)
        }
 
        // parameters / presettings
        const xScale = d3.scaleTime().range([0, width]);
             // define the line
        const valueline =  d3.line()
            .x((d) => { return xScale(d.year); })
            .y((d) => { return yScale(d.value); })
            .defined(d => d.value !== null);
        const yearRange = d3.range(metadata.startYear, metadata.stopYear).concat(metadata.stopYear);
        const parseTime = d3.timeParse('%Y');
        const data = yearRange.map(year => {
            return {
                year: parseTime(year),
                value: datum.values[0][year] 
            };
        }).filter(d => d.value !== null);
        
        // data-dependent settings
        const numberFormat = returnNumberFormats(dictionary[datum.values[0].indicator].units);

        xScale.domain(d3.extent(data, d => d.year));

        // using values below puts time graph on same scale as bubble graphs
        const minValue = ( metadata[datum.values[0].indicator].minAge !== undefined || metadata[datum.values[0].indicator].minRace !== undefined ) && datum.values[0].indicator !== 'population' ? d3.min([metadata[datum.values[0].indicator].minAge, metadata[datum.values[0].indicator].minRace]) : metadata[datum.values[0].indicator].minYear;
        const maxValue = ( metadata[datum.values[0].indicator].maxAge !== undefined || metadata[datum.values[0].indicator].maxRace !== undefined ) && datum.values[0].indicator !== 'population' ? d3.max([metadata[datum.values[0].indicator].maxAge, metadata[datum.values[0].indicator].maxRace]) : metadata[datum.values[0].indicator].maxYear;

        yScale.domain([0, maxValue]).nice(4);
       
        const $svg = d3.select(svg)
            .append('g')
            .classed('chart-group', true);
        
        const tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([viewBoxHeight * 2 - 10,0.5]) // TODO viewboxheight remains constant even as svgs scale, so tooltips become off place
            .html(d => `<span class="year">${d.year.getFullYear()}</span> | ${locale.format(dictionary[datum.values[0].indicator].tooltipFormat)(d.value)}`);

        //render valueline
        const chart = $svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        //render x-axis
        const xAxis = $svg.append('g')
          .attr('transform', `translate(${margin.left}, ${height + margin.top + 3})`)
          .attr('class', 'axis x-axis')
          .call(d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(4).tickValues([data[firstNonNullIndex(data)].year, data[data.length - 1].year]));

        //render y-axis
        const yAxis = $svg.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(${margin.left + 1}, ${margin.top})`)
            .call(d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(1).tickPadding(4).ticks(4, numberFormat));//.tickFormat(d3.format(numberFormat)));

        //render least squared  trendline
        var xSeries = d3.range(1, data.length + 1 - firstNonNullIndex(data));
        var ySeries = data.slice(firstNonNullIndex(data)).map(d => d.value);

        var leastSquaresCoeff = leastSquares(xSeries, ySeries);

        chart.append('line')
            .attr('class', 'line trendline')
            .attr('x1', xScale(data[firstNonNullIndex(data)].year))
            .attr('y1', yScale(leastSquaresCoeff[0] + leastSquaresCoeff[1]))
            .attr('x2', xScale(data[data.length - 1].year))
            .attr('y2', yScale(leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1]));

        chart.append('path')
            .datum(data)
            .attr('class', 'line valueline')
            .attr('d', valueline);

        var valuePoints = chart.selectAll('.value-point')
            .data(data.slice(firstNonNullIndex(data)))
            .enter().append('circle')
            .attr('class', 'value-point')
            .attr('tabindex', 0)
            .attr('focusable', true)
            .attr('data-id', (d,i) => `${group}-${datum.key}-${i}`)
            .attr('r', 1.25)
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.value))
            .on('focus', function(){
                var selector = '#rect-' + this.getAttribute('data-id');// IE does not support dataset on svg elements
                var node = d3.select(selector).node(); 
                var event = document.createEvent('Event'); // using old API instead of event constructor to support IE
                event.initEvent('mouseover', true, true);
                node.dispatchEvent(event);
            })
            .on('blur', function(){
                var node = d3.select('#rect-' + this.getAttribute('data-id')).node(); // IE does not support dataset on svg elements
                var event = document.createEvent('Event'); // using old API instead of event constructor to support IE
                event.initEvent('mouseout', true, true);
                node.dispatchEvent(event);
            });
        // going Vanilla because of d3.event weirdness
        valuePoints.nodes().forEach(function(circle){
            circle.addEventListener('keydown', goToSectionStart.bind(undefined, group));
        });

        chart.selectAll('.value-proxy-rect')
            .data(data.slice(firstNonNullIndex(data)))
            .enter().append('rect')
            .attr('id', (d,i) => `rect-${group}-${datum.key}-${i}`)
            .attr('class', 'value-proxy-rect')
            .attr('width', 8)
            .attr('height', 2 * viewBoxHeight)
            .attr('x', d => xScale(d.year) - 4)
            .attr('y', d => yScale(d.value) - viewBoxHeight)
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);


    }); // end onMount


</script>

<style lang="scss">
    @import './../variables.scss';
    :global(.svg-container) {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 116%;
        top: 40px;
        svg {
            position: absolute;
        }
    }
    :global(.line) {
        fill: none;
        transition: stroke-width 0.2s ease-in-out;
        vector-effect: non-scaling-stroke;

    }
    :global(.valueline){
        stroke: $blue;
        stroke-width: 3px;
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
            stroke-width: 1.5px; // IE doesn't support non-scaling-stroke
        }
        .svg-container:hover &, .svg-container:focus-within & {
            stroke-width: 3.5px;
            stroke: $orange;
        }
        //mix-blend-mode: color;
    }
    :global(.trendline){
        stroke: $medium_gray;
        stroke-width: 2px;
        .svg-container:hover &, .svg-container:focus-within & {
            stroke-width: 1px;
        }
    }

    :global(.value-point){
        transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out;
        fill: #fff;
        stroke: $blue;
        stroke-width: 1.25px;
        .svg-container:hover &, .svg-container:focus-within & {
            stroke: $orange;
        }

    }


    :global(.axis) path {
        vector-effect: non-scaling-stroke;

    }
    :global(g.tick) text {
        font-size: 7.5px;
        color: $gray;
    }
    :global(.y-axis g.tick) text {
    }
    :global(.x-axis g.tick) text {
        transform: translate(-8px, 0);
        font-weight: bold;
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
            text-anchor: end;
        }
    }
    :global(.x-axis g.tick:first-of-type) text {
        transform: translate(8px, 0);
        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
            text-anchor: start;
        }
    }
    :global(.y-axis path) {
     //  display: none;
    }
    
    :global(.value-proxy-rect) {
        fill: rgba(255,255,255,0);
    }
    :global(.d3-tip){
        white-space: nowrap;
    }
    :global(.d3-tip span.year) {
        font-weight: bold;
        
    }
    :global(.d3-tip.disaggregated > p){
        white-space: nowrap;
    }
    :global(.d3-tip.disaggregated > p span){
        display: inline-block;
        text-align: right;
    }
    :global(.d3-tip.disaggregated > p span.age){
        width: 62px;
    }
    :global(.d3-tip.disaggregated > p span.race){
        width: 200px;
    }
    

</style>
<figure class="svg-container chart-time">
    <svg focusable="false" class="chart-time" bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 {viewBoxHeight}">
    </svg>
</figure>



