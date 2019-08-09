<script>
    
    import { onMount } from 'svelte';
    import d3 from './../d3-importer.js';
    import dictionary from './../data/dictionary.json';
    export var datum;
    export let metadata;
    var svg;
    
    const viewBoxHeight = 116;

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

    onMount(() => {
        
        // parameters / presettings
        const margin = {
            top: 2,
            right: 2,
            bottom: 10,
            left: 20
        };
        const width = 100 - margin.left - margin.right;
        const height = viewBoxHeight - margin.top - margin.bottom;
        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
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
        });
        // data-dependent settings
        console.log(datum);
        
        const numberFormat = dictionary[datum.values[0].indicator].units === 'currency' ? '.0s' :
                             dictionary[datum.values[0].indicator].units === 'si' ? '.1s' :
                             dictionary[datum.values[0].indicator].units === 'number' ? '.0f' :
                             dictionary[datum.values[0].indicator].units === 'decimal' ? '.0f' :
                             '.0%';

        xScale.domain(d3.extent(data, d => d.year));

        const minValue = metadata[datum.values[0].indicator].minYear;
        const maxValue = metadata[datum.values[0].indicator].maxYear;
        const diff = maxValue - minValue;
        yScale.domain([minValue - 0.1 * diff, maxValue]);
        

        const $svg = d3.select(svg);
        
        const tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(d => d.value);

        //render valueline
        const chart = $svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(tip);

        chart.append('path')
            .datum(data)
            .attr('class', 'line valueline')
            .attr('d', valueline)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //render x-axis
        const xAxis = $svg.append('g')
          .attr('transform', `translate(${margin.left}, ${height})`)
          .attr('class', 'axis x-axis')
          .call(d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(4).tickValues([data[firstNonNullIndex(data)].year, data[data.length - 1].year]));

        //render y-axis
        const yAxis = $svg.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(4).ticks(6, numberFormat));//.tickFormat(d3.format(numberFormat)));


        //render least squared  trendline
        var xSeries = d3.range(1, data.length + 1 - firstNonNullIndex(data));
        var ySeries = data.slice(firstNonNullIndex(data)).map(d => d.value);

        var leastSquaresCoeff = leastSquares(xSeries, ySeries);

        console.log(leastSquaresCoeff);


        chart.append('line')
            .attr('class', 'line trendline')
            .attr('x1', xScale(data[firstNonNullIndex(data)].year))
            .attr('y1', yScale(leastSquaresCoeff[0] + leastSquaresCoeff[1]))
            .attr('x2', xScale(data[data.length - 1].year))
            .attr('y2', yScale(leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1]));

        //render OLD point to poiunt trendline
       /* chart.append('path')
            .datum([data[firstNonNullIndex(data)], data[data.length - 1]])
            .attr('class', 'line trendline')
            .attr('d', valueline);

        

        //render markers
        chart.selectAll('.trend-point')
            .data([data[firstNonNullIndex(data)], data[data.length - 1]])
            .enter().append('circle')
            .attr('class', 'trend-point')
            .attr('r', 2)
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.value));
*/
    

    }); // end onMount


</script>

<style lang="scss">
    @import './../variables.scss';
    .svg-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 116%;
        svg {
            position: absolute;
        }
    }
    :global(.line) {
        fill: none;
        vector-effect: non-scaling-stroke;

    }
    :global(.valueline){
        stroke: $medium_gray;
        .svg-container:hover & {
            stroke-width: 3px;
            color: $gray;
        }
    }
    :global(.trendline){
        stroke: $blue;
        stroke-width: 3px;
        .svg-container:hover & {
            stroke-width: 1px;
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
    }
    :global(.x-axis g.tick:first-of-type) text {
        transform: translate(8px, 0);
    }
    :global(.y-axis path) {
       display: none;
    }
    :global(.trend-point) {
        fill: $blue;
    }
</style>
<div class="svg-container">
    <svg bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 {viewBoxHeight}">
    </svg>
</div>



