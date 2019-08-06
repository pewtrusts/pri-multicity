<script>
    export let dataPromise;
</script>

<style lang="scss">
    .selections {
        outline: 1px solid magenta;
        width: 100%;
        height: 40px;
        display: flex;
    
    }
    .selections--waiting > div {
        width: 33%;
        height: 40px;
        outline: 1px solid cyan;
        &::after {
            content: 'hello';
        }
    }
    .selections--resolved > div {
        width: 33%;
        height: 40px;
        outline: 1px solid yellow;
    }
</style>

{#await dataPromise}
    <div class="selections selections--waiting">
        <div></div>        
        <div></div>        
        <div></div>        
    </div>
{:then value}
    <div class="selections selections--resolved">
        <div></div>        
        <div></div>        
        <div></div>        
    </div>
{:catch error}
    <p>Oops. Something went wrong</p>
    <code>{error.message}</code>
{/await}