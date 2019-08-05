<script>
    function clickHandler(e){
        alert('click');
        console.log(e);
    }
</script>

<style>
</style>

<button on:click="{clickHandler}" role="button">Click this button</button>