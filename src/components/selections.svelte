<script>
    import Loading from './loading.svelte';
    export let dataPromise;
</script>

<style lang="scss">
    .selections {
        width: 100%;
        height: 40px;
        display: flex;
    }
    .selections > div {
        width: 33%;
        height: 40px;
    }
</style>

<div class="selections wire">
{#await dataPromise}
    <div>
        <Loading />
    </div>        
    <div>
        <Loading />
    </div>        
    <div>
        <Loading />
    </div>        
{:then value}
    <div></div>  <!-- different selection types go here -->      
    <div></div>        
    <div></div>        
{:catch error}
    <p>Oops. Something went wrong</p>
    <code>{error.message}</code>
{/await}
</div>