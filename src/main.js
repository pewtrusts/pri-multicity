/* global PUBLICPATH process */
import Papa from 'papaparse';
import d3 from './d3-importer';
import { readable } from 'svelte/store';
import App from './App.svelte';
import data from './data/dashboard-data-1.csv';
import MakeQueriablePromise from './MakeQueriablePromise.js';

const initialOrganizeBy = 'indicator';
const initialIndicator = 'poverty';
// array of cities to render while the dataPromise is being resolved
const initialCities = ["Baltimore", "Boston", "Chicago", "Cleveland", "Detroit", "Houston", "Philadelphia", "Phoenix", "Pittsburgh", "Washington D.C."]

var publicPath = '';
if ( process.env.NODE_ENV === 'production' ) { // production build needs to know the public path of assets
                                               // for dev and preview, assets are a child of root; for build they
                                               // are in some distant path on sitecore
    publicPath = PUBLICPATH; 
}

function getData(resolve, reject){
    Papa.parse(publicPath + data, {
        complete: function(results){
            console.log(results);
            var nested = d3.nest().key(d => d.indicator).key(d => d.city).entries(results.data);
            setTimeout(() => {
                resolve(nested);
                console.log(nested);
            },2000);
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

const dataPromise = MakeQueriablePromise(new Promise((resolve, reject) => {
    getData(resolve, reject);
}));
console.log(dataPromise);
const app = new App({
	target: document.querySelector('#svelte-container'),
	props: {
        dataPromise,
        initialCities,
        initialIndicator
	}
});

window.app = app;

export default app;