/* global PUBLICPATH process BUILDTYPE */
import Papa from 'papaparse';
import d3 from './d3-importer';
import App from './App.svelte';
import data from './data/dashboard-data.csv';
import overview from './overview.html';
import dictionary from './data/dictionary.json';

const metadata = {
    startYear: 2008,
    stopYear: 2018
};
if ( BUILDTYPE !== 'production' && document.querySelector('#overview-container') ){
    document.querySelector('#overview-container').innerHTML = overview;
}
console.log(PUBLICPATH + data);
function summarizeData(data){
    data.forEach((d,i,array) => {
        metadata[d.indicator] = metadata[d.indicator] || {};
        metadata[d.city] = metadata[d.city] || {};

        //put values from all years into one array
        var years = d3.range(metadata.startYear, metadata.stopYear).concat(metadata.stopYear);
        metadata[d.indicator].yearValues = metadata[d.indicator].yearValues ? metadata[d.indicator].yearValues.concat(years.map(x => d[x])) : years.map(x => d[x]);
        metadata[d.city].yearValues = metadata[d.city].yearValues ? metadata[d.city].yearValues.concat(years.map(x => d[x])) : years.map(x => d[x]);
        // same for race
        var races = Object.keys(d).filter(key => key.match(/race\d$/));
        metadata[d.indicator].raceValues = metadata[d.indicator].raceValues ? metadata[d.indicator].raceValues.concat(races.map(x => d[x])) : races.map(x => d[x]);
        metadata[d.city].raceValues = metadata[d.city].raceValues ? metadata[d.city].raceValues.concat(races.map(x => d[x])) : races.map(x => d[x]);
        // same for age
        var ages = Object.keys(d).filter(key => key.match(/age\d$/));
        metadata[d.indicator].ageValues = metadata[d.indicator].ageValues ? metadata[d.indicator].ageValues.concat(ages.map(x => d[x])) : ages.map(x => d[x]);
        metadata[d.city].ageValues = metadata[d.city].ageValues ? metadata[d.city].ageValues.concat(ages.map(x => d[x])) : ages.map(x => d[x]);
        // same for raceA
        var racesA = Object.keys(d).filter(key => key.match(/race\d_a/));
        metadata[d.indicator].raceValuesA = metadata[d.indicator].raceValuesA ? metadata[d.indicator].raceValuesA.concat(racesA.map(x => d[x])) : racesA.map(x => d[x]);
        metadata[d.city].raceValuesA = metadata[d.city].raceValuesA ? metadata[d.city].raceValuesA.concat(racesA.map(x => d[x])) : racesA.map(x => d[x]);
        // same for ageA
        var agesA = Object.keys(d).filter(key => key.match(/age\d_a/));
        metadata[d.indicator].ageValuesA = metadata[d.indicator].ageValuesA ? metadata[d.indicator].ageValuesA.concat(agesA.map(x => d[x])) : agesA.map(x => d[x]);
        metadata[d.city].ageValuesA = metadata[d.city].ageValuesA ? metadata[d.city].ageValuesA.concat(agesA.map(x => d[x])) : agesA.map(x => d[x]);
    });
    for ( let key in metadata ) {
        if ( !key.match(/start|stop/)) {
            metadata[key].maxYear = d3.max(metadata[key].yearValues.filter(d => !isNaN(d)));
            metadata[key].minYear = d3.min(metadata[key].yearValues.filter(d => !isNaN(d)));
            metadata[key].maxRace = d3.max(metadata[key].raceValues.filter(d => !isNaN(d)));
            metadata[key].minRace = d3.min(metadata[key].raceValues.filter(d => !isNaN(d)));
            metadata[key].maxAge = d3.max(metadata[key].ageValues.filter(d => !isNaN(d)));
            metadata[key].minAge = d3.min(metadata[key].ageValues.filter(d => !isNaN(d)));
            metadata[key].maxPop = d3.max(metadata[key].ageValuesA.filter(d => !isNaN(d)).concat(metadata[key].raceValuesA.filter(d => !isNaN(d))));
            metadata[key].minPop = d3.min(metadata[key].ageValuesA.filter(d => !isNaN(d)).concat(metadata[key].raceValuesA.filter(d => !isNaN(d))));

        }
    }
    var minPops = [], maxPops = [];
    for ( let key in metadata ){
        if ( !key.match(/start|stop/)) {
           minPops.push(metadata[key].minPop); 
           maxPops.push(metadata[key].maxPop); 
        }   
    }
    metadata.minPop = d3.min(minPops);
    metadata.maxPop = d3.max(maxPops);
}
function getData(resolve, reject){
    function phillyFirst(a,b){
        if ( a === 'Philadelphia'){
            return -1;
        }
        if ( b === 'Philadelphia'){
            return 1;
        }
        var sorted = [a,b].sort();
        if ( sorted[0] === a ){
            return -1;
        }
        return 1;
    }
    function sortIndicators(a,b){
        return dictionary.order.indexOf(a) - dictionary.order.indexOf(b);
    }
    Papa.parse(data, {
        complete: function(results){
            summarizeData(results.data);
            
            var nestedByIndicator = d3.nest().key(d => d.indicator).sortKeys(sortIndicators).key(d => d.city).sortKeys(phillyFirst).entries(results.data);
            var nestedByCity = d3.nest().key(d => d.city).sortKeys(phillyFirst).key(d => d.indicator).sortKeys(sortIndicators).entries(results.data);
            resolve({nestedByIndicator,nestedByCity});
        },
        download: true,
        dynamicTyping: true,
        error: function(error, file) {
            reject({ error, file });
        },
        fastMode: true,
        header: true,
        skipEmptyLines: true
    });
}

const dataPromise = new Promise((resolve, reject) => {
    getData(resolve, reject);
});
dataPromise.then(data => {
    new App({
    	target: document.querySelector('#svelte-container'),
    	props: {
            data,
            metadata
    	}
    });
});