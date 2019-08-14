<script>
    import Overview from './components/overview.svelte';
    import Selections from  './components/selections.svelte';
    import Dataviz from  './components/dataviz.svelte';
    //import { afterUpdate } from 'svelte';
    export let data;
    export let initialCities;
    export let initialIndicator;
    export let metadata;
    
</script>

<style>
    :global(.wire), :global(.wire) * {
        outline: 1px solid magenta;
    }   
</style>

<Overview />
<Selections {data} />
<Dataviz {data} {initialCities} {metadata} />
