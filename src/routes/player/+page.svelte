
<script lang='ts'>
    import Vidmoly from '$lib/components/media-players/Vidmoly.svelte';
    import Intuitive from '$lib/components/intuitive/Intuitive.svelte';
</script>

<Intuitive/>

<div class="Vidmoly">
    <Vidmoly title="Sword Art Online Movie" srcKey="vubls2u9s6dy" width={1280} height={720}/>
</div>

<style>
    :global(body) {
		background-color: #222222; 
	}

    .Vidmoly {
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>