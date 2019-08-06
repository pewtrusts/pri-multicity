<script>
    import Overview from './components/overview.svelte';
    import Selections from  './components/selections.svelte';
   // import Dataviz from  './components/dataviz.svelte';
    //import { afterUpdate } from 'svelte';
    export let dataPromise;
    
</script>

<style lang="scss">
    @import 'variables.scss';
	:global(.isWaiting) {
        background-color: $light_gray;
    }
</style>

<Overview />
<Selections {dataPromise} />
<!--  Dataviz / -->
