<script>
    export let dataPromise;
</script>

<style>
    .selections {
        outline: 1px solid magenta;
        width: 100%;
        height: 40px;
    }
    .selections--waiting > div {
        width: 33%;
        height: 40px;
        outline: 1px solid cyan;
    }
    .selections--resolved > div {
        width: 33%;
        height: 40px;
        outline: 1px solid yellow;
    }
</style>

<div class="selections">
{#await dataPromise}
    <div class="selections--waiting">
        <div></div>        
        <div></div>        
        <div></div>        
    </div>
{:then value}
    <div class="selections--resolved">
        <div></div>        
        <div></div>        
        <div></div>        
    </div>
{:catch error}
    <p>Oops. Something went wrong</p>
    <code>{error.message}</code>
{/await}
</div>