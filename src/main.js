/* global PUBLICPATH process */
import Papa from 'papaparse';
import * as d3 from 'd3-collection';
import { readable } from 'svelte/store';
import App from './App.svelte';
import data from './data/dashboard-data.csv';

const initialOrganizeBy = 'indicator';
const initialIndicator = 'poverty';

var publicPath = '';
if ( process.env.NODE_ENV === 'production' ) { // production build needs to know the public path of assets
                                               // for dev and preview, assets are a child of root; for build they
                                               // are in some distant path on sitecore
    publicPath = PUBLICPATH; 
}

function getData(resolve, reject){
    Papa.parse(publicPath + data, {
        complete: function(results){
            var nested = d3.nest().key(d => d.indicator).key(d => d.city).entries(results.data);
            console.log(nested);
            resolve(nested);
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

const app = new App({
	target: document.querySelector('#svelte-container'),
	props: {
        dataPromise
	}
});

window.app = app;

export default app;