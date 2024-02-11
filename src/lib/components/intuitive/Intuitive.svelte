<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import { onDestroy, onMount } from "svelte";
    import { navigate } from 'svelte-routing';
    import { page } from '$app/stores';
    import { flip } from 'svelte/animate';
    import { IntuitiveStates, SearchSteps } from "$lib/components/intuitive/intuitive-states";
    import { 
        isSearchOpenEvent, 
        isEscapeEvent, 
        isHideToggleEvent, 
        isNavLeftEvent,
        isNavRightEvent,
    } from "$lib/components/intuitive/keyboard-event-checking";

    export let vidmolySrcKey: String = ""

    let intuitiveNaviguation: HTMLElement;
    let intuitiveSearch: HTMLElement;

    let locked: boolean = false;
    let currentState: IntuitiveStates = IntuitiveStates.Navigation;
    let beforeSearchState: IntuitiveStates = IntuitiveStates.Navigation;
    let beforeHiddenState: IntuitiveStates = IntuitiveStates.Navigation;

    let currentSearchingStep: SearchSteps = SearchSteps.Content;

    let searchResults: Record<string, any>[] = [];
    let selectedContent: Record<string, any> = {};

    let timeout: number;

    function intuitiveSearchOpen() {
        beforeSearchState = currentState;
        currentState = IntuitiveStates.Search;
    }

    function intuitiveSearchClose() {
        currentState = beforeSearchState;
        searchResults = [];
    }

    function intuitiveHideToggle() {
        if (currentState === IntuitiveStates.Hidden) {
            currentState = beforeHiddenState;
        } 
        else {
            beforeHiddenState = currentState;
            currentState = IntuitiveStates.Hidden;
        }
    }

    async function onSearchInputChange(event: Event) {

        // Bloquer les requêtes trop fréquentes pour éviter de surcharger le serveur
        // Et éviter les bugs visuels du au change d'état trop rapide
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const seacrhInput = (event.target as HTMLInputElement).value;

            if (seacrhInput.length < 2) {
                searchResults = [];
                return;
            }
            
            const response = await fetch('/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ query: seacrhInput }),
                    headers: {
                        'content-type': 'application/json',
                    },
                }
            );

            searchResults = await response.json();
        }, 300); // Attendre 300ms avant de mettre à jour
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (locked) return;

        if (isSearchOpenEvent(event) && currentState !== IntuitiveStates.Search) {
            intuitiveSearchOpen();
        } 
        else if (isEscapeEvent(event)) {
            if (currentState === IntuitiveStates.Search) {
                intuitiveSearchClose();
            }
        } 
        else if (isHideToggleEvent(event) && currentState !== IntuitiveStates.Search) {
            intuitiveHideToggle();
        } 
    };
  
    function onSearchResultClick(result: any) {
        currentSearchingStep = SearchSteps.Episode
        selectedContent = result;
    };

    onMount(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeyPress);
        }
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', handleKeyPress);
        }
    });
</script>

{#if currentState === IntuitiveStates.Navigation}
    <div id="intuitive-naviguation" class="intuitive-widget" bind:this={intuitiveNaviguation} transition:fly={{ y: 100, duration: 600 }}>          
        <nav class="intuitive-bar">
            <button class="nav-button" style:border-width={$page.url.pathname === "/" ? "1px" : "0px"}><a href="/">Home</a></button>
            <button class="nav-button" style:border-width={$page.url.pathname === "/player" ? "1px" : "0px"}><a href="/player">Player</a></button>
            <button class="nav-button" style:border-width={$page.url.pathname === "/my-list" ? "1px" : "0px"}><a href="/my-list">My list</a></button>
            <button class="nav-button" style:border-width={$page.url.pathname === "/profil" ? "1px" : "0px"}><a href="/profil">Profil</a></button>
        </nav>
    </div> 
{:else if currentState === IntuitiveStates.Search}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="dark-blur-effect" transition:fade on:click={intuitiveSearchClose}></div>
    {#if currentSearchingStep === SearchSteps.Content}
        <div id="intuitive-search" class="intuitive-widget" bind:this={intuitiveSearch} transition:fly={{ y: 100, duration: 600 }}>
            <div class="intuitive-bar">
                <!-- svelte-ignore a11y-autofocus -->
                <input type="text" placeholder="Search..." class="search-input" autofocus on:input={onSearchInputChange}/>
            </div>
            <div class="search-results">
                {#each searchResults as result (result.id)}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <img 
                        src={result.image_url} 
                        alt={"cover of " + result.title} 
                        in:fly={{ y: 100, duration: 600 }}
                        out:fade={{ duration: 200 }}
                        animate:flip={{ duration: 500 }}
                        on:click={() => onSearchResultClick(result)}
                    >
                {/each}
            </div>      
        </div>
    {:else if currentSearchingStep === SearchSteps.Episode}
        <div id="content-overview" class="intuitive-widget">
            <img src={selectedContent.image_url} alt={"cover of " + selectedContent.title}>
        </div>
    {/if}
{/if}

<style>
    #intuitive-naviguation {
        display: flex;
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translate(-50%,0%);
        flex-direction: column;
    }

    #intuitive-search {
        display: flex;
        position: fixed;
        height: 70%;
        width: 90%;
        top: 20%;
        left: 5%;
        flex-direction: column;
        align-items: center;
    }

    .intuitive-widget {
        z-index: 1000;
    }

    .dark-blur-effect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        backdrop-filter: blur(5px);
        background-color: rgba(0, 0, 0, 0.4);
        pointer-events: auto;
    }

    .intuitive-bar {       
        /* shape */
        border-radius: 10px;
        height: 50px;
        /* appearance */
        background-color: #151515;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.5);
        /* content */
        display: flex;
        align-items: center; 
        justify-content: center;
    }

    .nav-button {
        background-color: #282828;
        border-color: white;
        border-style: solid;
        border-width: 0px;
        padding: 10px 22px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        margin: 0 5px;
    }

    .nav-button:hover {
        background-color: #333333;
    }

    .nav-button a {
        font-family: Arial;
        text-decoration: none;
        color: white;
    }

    .search-input {
        background-color: #333333;
        border: none;
        padding: 10px 20px;
        margin: 0 6px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        width: 500px;
        outline: none;
        color: white;
    }

    .search-results {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: 20px;
        overflow-x: scroll;
        overflow-y: hidden;
        scrollbar-width: 0px;
        scrollbar-color: transparent transparent;
    }

    .search-results img {
        width: 22%;
        object-fit: contain;
        border-radius: 5px;
        box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.3);
        margin: 0 20px;
        cursor: pointer;
    }    

    .search-results img:hover {
        box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.6);
        transform: scale(1.05);
    }

    #content-overview {
        display: flex;
        position: fixed;
        height: 70%;
        width: 90%;
        top: 20%;
        left: 5%;
        flex-direction: row;
        align-items: center;
    }

    #content-overview img {
        width: 30%;
        object-fit: contain;
        border-radius: 5px;
        box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.3);
        margin: 0 20px;
    }
</style>