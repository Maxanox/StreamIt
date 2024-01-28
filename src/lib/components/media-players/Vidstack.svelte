<script lang='ts'>
    import 'vidstack/player/styles/default/theme.css';
    import 'vidstack/player/styles/default/layouts/video.css';
    import 'vidstack/player';
    import 'vidstack/player/layouts';
    import 'vidstack/player/ui';
    
    import { isHLSProvider } from 'vidstack';
    import type { MediaProviderChangeEvent } from 'vidstack';
    import type { MediaPlayerElement } from 'vidstack/elements';

    // Required
    export let title: string;
    export let src: string;

    // Optional
    export let width: number = 640;
    export let height: number = 360;

    let player: MediaPlayerElement;

    // This is where you can configure the provider
    // Can be called like this: <media-player ... on:provider-change={onProviderChange}>
    function onProviderChange(event: MediaProviderChangeEvent) {
        let provider = event.detail;
        if (isHLSProvider(provider)) {
            /* 
            For example, you can add headers to the request
            provider.config = {
                xhrSetup: (xhr, url) => {
                    xhr.setRequestHeader("Header", "Value");
                }
            }
            */
        }
    };
</script>

<media-player crossorigin bind:this={player} title={title} src={src} style="aspect-ratio: 16/9; width: {width}px; height: {height}px:">
    <media-provider></media-provider>
    <media-video-layout></media-video-layout>
</media-player>