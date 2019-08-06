/* global PUBLICPATH process */
import Papa from 'papaparse';
import { readable } from 'svelte/store';
import App from './App.svelte';
import data from './data/dashboard-data.csv';

var publicPath = '';
if ( process.env.NODE_ENV === 'production' ) { // production build needs to know the public path of assets
                                              // for dev and preview, assets are a child of root; for build they
                                              // are in some distant path on sitecore
    publicPath = PUBLICPATH; 
}

function getData(resolve, reject){
    Papa.parse(publicPath + data, {
        complete: function(results){
            resolve(results.data);
        },
        download: true,
        error: function(error, file) {
            reject({ error, file });
        },
        header: true,
        skipEmptyLines: true
    });
}

const initialOrganizeBy = 'indicator';
const initialIndicator = 'poverty';
const dataPromise = new Promise((resolve, reject) => {
    getData(resolve, reject);
});

const app = new App({
	target: document.querySelector('#svelte-container'),
	props: {
        name: 'hello';
	}
});

window.app = app;

export default app;