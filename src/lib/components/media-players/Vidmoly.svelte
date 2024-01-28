<script lang="ts">
    // Required
    export let title: string;
    export let srcKey: string;
    
    // Optional
    export let allowFullscreen: boolean = true;
    export let width: number = 640;
    export let height: number = 360;
    export let borderRadius: number = 15;
</script>

<iframe 
    title={title} 
    src="//vidmoly.to/embed-{srcKey}.html" 
    scrolling="no" 
    frameborder=0 
    width={width}
    height={height}
    allow={allowFullscreen ? "fullscreen" : ""}
    style="border-radius: {borderRadius}px;">
</iframe>
