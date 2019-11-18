import d3 from './../d3-importer.js';
const margin = {
    top: 10,
    right: 5,
    bottom: 15,
    left: 23.5
}
const viewBoxHeight = 116;
const height = viewBoxHeight - margin.top - margin.bottom;
export default {
    clearExisting(svg){
        d3.select(svg).select('.chart-group').remove();
        // a bit of a brute force option to make sure svgs clear existing content before update;
        // perhaps would have been better to compose so that d3 could do exit().remove() on the charts
    },
    goToSectionStart(group, e){
        if ( e.keyCode === 27 ){
            document.querySelector('.js-skip-link-' + group).focus();
        }
    },
    height,
    locale: d3.formatLocale({
        decimal: '.',
        thousands: ',',
        grouping: [3],
        currency: ['$', '']
        
    }),
    margin,
    returnNumberFormats(units){
        const numberFormat = units === 'currency' ? '$.0s' :
                             units === 'si' ? '.1s' :
                             units === 'number' ? '.0f' :
                             units === 'decimal' ? '.0f' :
                             '.0%';
        return numberFormat;
    },
    svg: undefined,
    viewBoxHeight,
    width: 100 - margin.left - margin.right,
    yScale: d3.scaleLinear().range([height, 0]),
};