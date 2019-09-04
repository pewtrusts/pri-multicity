<script>
import { beforeUpdate } from 'svelte';
import d3 from './../d3-importer.js';
import dictionary from './../data/dictionary.json';
export let datum;
export let group;
export let metadata;
export let groupBy;
console.log(groupBy);
$: cityOrIndicator = groupBy === 'nestedByCity' ? 'city' : 'indicator';
import './../d3-tip.scss';
console.log(this);
var svg;

let zScaleDomain = [metadata.minPop, metadata.maxPop];
const viewBoxHeight = 116;
const maxRadius = 15;
const minRadius = 5;

function goToSectionStart(group, e){
    if ( e.keyCode === 27 ){
        document.querySelector('.js-skip-link-' + group).focus();
    }
}

beforeUpdate(() => {

    if ( svg ){
        svg.innerHTML = '';
    }


    // parameters / presettings
        const margin = {
            top: 10,
            right: 5,
            bottom: 15,
            left: 20
        };
    const locale = d3.formatLocale({
            decimal: '.',
            thousands: ',',
            grouping: [3],
            currency: ['$', '']
            
        });
    const width = 100 - margin.left - margin.right;
    const height = viewBoxHeight - margin.top - margin.bottom;
    const xScale = d3.scaleOrdinal().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);
    const zScale = d3.scaleSqrt().range([minRadius, maxRadius]);
    const ageValues = [datum.values[0].age1_a, datum.values[0].age2_a,datum.values[0].age3_a].sort((a,b) => d3.descending(a,b));
    const raceValues = [datum.values[0].race1_a,datum.values[0].race2_a,datum.values[0].race3_a,datum.values[0].race4_a].sort((a,b) => d3.descending(a,b));
    const data = [
        [{ colorIndex: 0, percent: datum.values[0].age1, absolute: datum.values[0].age1_a, key: 'age1' }, { colorIndex: 1, percent: datum.values[0].age2, absolute: datum.values[0].age2_a, key: 'age2' }, { colorIndex: 2, percent: datum.values[0].age3, absolute: datum.values[0].age3_a, key: 'age3' }],
        [{ colorIndex: 0, percent: datum.values[0].race1, absolute: datum.values[0].race1_a, key: 'race1' }, { colorIndex: 1, percent: datum.values[0].race2, absolute: datum.values[0].race2_a, key: 'race2' }, { colorIndex: 2, percent: datum.values[0].race3, absolute: datum.values[0].race3_a, key: 'race3' }, { colorIndex: 3, percent: datum.values[0].race4, absolute: datum.values[0].race4_a, key: 'race4' }]
    ];
    console.log(data);
    
    // data-dependent settings
    console.log(datum);
    const units = dictionary[datum.values[0].indicator].units_alt || dictionary[datum.values[0].indicator].units;
    const numberFormat = units === 'currency' ? '.0s' :
        units === 'si' ? '.1s' :
        units === 'number' ? '.0f' :
        units === 'decimal' ? '.0f' :
        '.0%';

    

    xScale.domain([0, data.length]);
    const calcMin = d3.min([metadata[datum.values[0].indicator].minAge, metadata[datum.values[0].indicator].minRace]);
    const calcMax =  d3.max([metadata[datum.values[0].indicator].maxAge, metadata[datum.values[0].indicator].maxRace]);

    // for indicators where disaggregated data are not available, set the domain based on the year data
    const minValue = calcMin !== undefined ? calcMin : metadata[datum.values[0].indicator].minYear;
    const maxValue = calcMax !== undefined ? calcMax : metadata[datum.values[0].indicator].maxYear;
    yScale.domain([0, maxValue]).nice(4);
    
    //domain below makes bubbles size comparable in group only
    //zScale.domain([metadata[datum.values[0][cityOrIndicator]].minPop, metadata[datum.values[0][cityOrIndicator]].maxPop]); 

    // here population sizes are comparable across groups
    zScale.domain(zScaleDomain); 
    xScale.domain(['Age', 'Race']);

    const tip = d3.tip()
        .attr('class', 'd3-tip disaggregated')
        
        .html((d, i) => { // i = 0
            var indicator = cityOrIndicator === 'indicator' ? group : datum.key;

            return d.sort((a, b) => d3.descending(a.percent, b.percent)).reduce((acc, cur, j) => {
                var type = cur.key.match('age') ? 'age' : 'race';
                var values = type === 'age' ? ageValues : raceValues;
                return acc + `<p class="${  values.indexOf(cur.absolute) === i ? 'isHighlighted' : ''} ${'tooltip-p tooltip-color-' + cur.colorIndex}""><span class="${type}">${dictionary[cur.key]}</span> | ${dictionary[indicator] && dictionary[indicator].disagTooltipFormat ? locale.format(dictionary[indicator].disagTooltipFormat)(cur.percent) : locale.format(dictionary[indicator].tooltipFormat)(cur.percent)} 
                                 (${ cur.absolute ? d3.format(',.0f')(cur.absolute) + ' ppl' : 'size n/a'})</p>`;
            }, '')
        });
    const NATip = d3.tip()
        .attr('class', 'd3-tip disaggregated d3-tip--not-available')
        .html(d => {
            var indicator = cityOrIndicator === 'indicator' ? group : datum.key;
            return `<p class="tooltip-p-na"><strong>${dictionary[indicator] && dictionary[indicator].disagTooltipFormat ? locale.format(dictionary[indicator].disagTooltipFormat)(d.value) : locale.format(dictionary[indicator].tooltipFormat)(d.value)}</strong> | Data by ${d.groupIndex === 0 ? 'age' : 'race' } not available</p>`;
        });

    const $svg = d3.select(svg);


    //render x-axis
    const xAxis = $svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height + margin.top + 3})`)
        .attr('class', 'axis x-axis categorical')
        .call(d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(4));


    //render y-axis
    const yAxis = $svg.append('g')
        .attr('class', 'axis y-axis')
        .attr('transform', `translate(${margin.left + 3}, ${margin.top})`)
        .call(d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(1).tickPadding(4).ticks(4, numberFormat)); //.tickFormat(d3.format(numberFormat)));

    /*const tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([viewBoxHeight * 2 - 10,0.5])
        .html(d => `<span class="year">${d.year.getFullYear()}</span>${locale.format(dictionary[datum.values[0].indicator].tooltipFormat)(d.value)}`);*/

    //render groups for each circle-label pair
    const typeGroup = $svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .selectAll('.type')
        .data(data)
        .enter().append('g')
        .attr('transform', (d, i, array) => {
            if (i === 0) {
                return `translate(${maxRadius}, 0)`;
            }
            return `translate(${width - maxRadius}, 0)`;

        });

    typeGroup.each(function(p, j, peas) {
        if ( p.filter(x => !isNaN(x.percent)).length > 0 ){ // append circles only if the array contains valid data
            let dataGroup = d3.select(this)
                .selectAll('.data-group')
                .data(d => {
                    console.log(d);
                    return d.sort((a, b) => d3.descending(a.absolute, b.absolute));
                })
                .enter().append('g')
                .attr('class', 'data-group')
                .append('circle')
                .attr('tabindex', 0)
                .attr('cx', 0)
                .attr('cy', d => {
                    return yScale(d.percent);
                })
                .attr('r', d => {
                    if (d.absolute !== null) {
                        return zScale(d.absolute);
                    }
                    return minRadius / 2;
                })
                .attr('class', d => 'bubble color' + d.colorIndex)
                .classed('absolute-undefined', d => d.absolute === null)
                .call(tip)
                .on('mouseover', function(d,i){
                    tip.show.call(this,p.filter(x => !isNaN(x.percent)),i); // pass parent data in to the tooltip
                })
                .on('mouseout', tip.hide)
                .on('focus', function(d,i){
                    tip.show.call(this,p.filter(x => !isNaN(x.percent)),i); // pass parent data in to the tooltip
                })
                .on('blur', tip.hide);

                // going Vanilla because of d3.event weirdness
                dataGroup.nodes().forEach(function(g){
                    g.addEventListener('keydown', goToSectionStart.bind(undefined, group));
                });
        } else {
            let selection = d3.select(this)
                .datum(datum.values[0][metadata.stopYear]);
            selection
                .append('rect')
                .attr('class','aggregated')
                .attr('height', 2)
                .attr('width', 10)
                .attr('x', -5)
                .attr('y', d => yScale(d));
            selection
                .append('circle')
                .attr('class', 'aggregated-circle')
                .attr('r', 14)
                .attr('cy', d => yScale(d))
                .attr('cx', 0)
                .call(NATip)
                .on('mouseover', function(d){
                    NATip.show.call(this, {groupIndex: j, value: d});
                })
                .on('mouseout', NATip.hide);
/*
                .append('text')
                .attr('class', 'not-available')
                .text(d => d)
                .attr('y', height / 2);*/
        }

        //append labels
        /*  dataGroup
              .append('text')
              .attr('class', 'data-label')
              .attr('dy', '0.4em')
              .text(d => dictionary[d.key])
              .attr('y', d => {
                  return height - yScale(d.percent);
              })
              .attr('x', maxRadius + 2);*/
    });









    /*  var simulation = d3.forceSimulation()
          //.force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
          //.force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
          .force("collide", d3.forceCollide().strength(.01).radius(30).iterations(1)); // Force that avoids circle overlapping */

    //render x-axis
    /*        const xAxis = $svg.append('g')
              .attr('transform', `translate(${margin.left}, ${height})`)
              .attr('class', 'axis x-axis')
              .call(d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(4).tickValues([data[firstNonNullIndex(data)].year, data[data.length - 1].year]));*/

    //render y-axis
    /*  const yAxis = $svg.append('g')
          .attr('class', 'axis y-axis')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .call(d3.axisLeft(yScale).tickSizeInner(0).tickSizeOuter(0).tickPadding(4).ticks(6, numberFormat));//.tickFormat(d3.format(numberFormat)));*/


    //render least squared  trendline



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

:global(.data-group circle) {

   // fill: #fff;
    fill-opacity: 0.75;
    stroke-width: 0;
    mix-blend-mode: darken;
    transition: fill-opacity 0.2s ease-in-out;
    &:hover, &:focus {
        fill-opacity: 1;
        //outline: none;
    }
  
}
:global(circle.aggregated-circle) {
    fill: rgba(255,255,255,0);
}
:global(.data-label) {
    font-size: 7.5px;
}

:global(.color0) {
    fill: $teal;
    stroke: $teal;
    ;
}

:global(.color1) {
    fill: $orange;
    stroke: $orange;
    ;
}

:global(.color2) {
    fill: $red;
    stroke: $red;
    ;
}

:global(.color3) {
    fill: $light_blue;
    stroke: $light_blue;
    ;
}


:global(.axis) path {
    vector-effect: non-scaling-stroke;

}

:global(g.tick) text {
    font-size: 7.5px;
    color: $gray;

}

:global(.y-axis g.tick) text {}

:global(.x-axis g.tick) text {
    transform: translate(-8px, 0);
    font-weight: bold;

}

:global(.x-axis g.tick:first-of-type) text {
    transform: translate(8px, 0);
}

:global(.x-axis.categorical g.tick) text {
    transform: translate(-15px, 0);

}

:global(.x-axis.categorical g.tick:first-of-type) text {
    transform: translate(13px, 0);

}

:global(.y-axis path) {
    display: none;
}

:global(.trend-point) {
    fill: $blue;
}

:global(rect.aggregated) {
    fill: $blue;
}

:global(.tooltip-p-na) {
    margin-bottom: 0;
    line-height: 100%;
}
:global(.tooltip-p) {
    margin-bottom: 0.5em;
    padding-left: 12px;
    text-indent: -12px;
    line-height: 100%;
    font-weight: 400;
    opacity: .65;
    

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #000;
        display: inline-block;
        margin-right: 4px;
        position: relative;
        bottom: 2px;
        opacity: 0.5;
    }

    &.tooltip-color-0::before {
        background-color: $teal;
    }

    &.tooltip-color-1::before {
        background-color: $orange;
    }

    &.tooltip-color-2::before {
        background-color: $red;
    }

    &.tooltip-color-3::before {
        background-color: $light_blue;
    }

}
:global(.tooltip-p.isHighlighted){ 
    opacity: 1;
    span {
        font-weight: 800;
    }
    &::before {
        opacity: 1;
    }
}
:global(.not-available){
    font-size: 7.5px;
    text-anchor: middle;
}
</style>
<div class="svg-container">
    <svg bind:this={svg} width="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 {viewBoxHeight}">
    </svg>
</div>