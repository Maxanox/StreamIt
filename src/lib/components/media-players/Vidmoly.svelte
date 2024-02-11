<script lang="ts">
    // Required
    export let title: string;
    export let srcKey: string;
    
    // Optional
    export let allowFullscreen: boolean = true;
    export let width: number = 640;
    export let height: number = 360;
    export let borderRadius: number = 15;
    export let frameborder: number = 0;
    export let scrolling: boolean = false;
</script>

<iframe 
    title={title} 
    src="//vidmoly.to/embed-{srcKey}.html" 
    scrolling={scrolling ? "yes" : "no"}
    frameborder={frameborder}
    width={width}
    height={height}
    allowfullscreen={allowFullscreen}
    style="border-radius: {borderRadius}px;">
</iframe>
